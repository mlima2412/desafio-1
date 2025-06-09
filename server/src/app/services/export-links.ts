import { PassThrough, Transform } from "node:stream";
import { pipeline } from "node:stream/promises";
import { db, pg } from "../../infra/db/index.ts";
import { schema } from "../../infra/db/schemas/index.ts";
import { uploadFileToStorage } from "../../infra/storage/upload-file-to-storage.ts";
import { stringify } from "csv-stringify";
import { ilike } from "drizzle-orm";
import { z } from "zod";

const exportSearchQuery = z.object({
	searchQuery: z.string().optional(),
});

type ExportSearchQuery = z.input<typeof exportSearchQuery>;

type ExportLinks = {
	reportUrl: string;
};

export async function exportLinks(
	input: ExportSearchQuery
): Promise<ExportLinks> {
	const { searchQuery } = exportSearchQuery.parse(input);

	const { sql, params } = db
		.select({
			id: schema.links.id,
			originalUrl: schema.links.originalUrl,
			shortUrl: schema.links.shortUrl,
			number: schema.links.numberOfClicks,
			createdAt: schema.links.createdAt,
		})
		.from(schema.links)
		.where(
			searchQuery
				? ilike(schema.links.originalUrl, `%${searchQuery}%`)
				: undefined
		)
		.toSQL();

	const cursor = pg.unsafe(sql, params as string[]).cursor(2);

	const csv = stringify({
		delimiter: ",",
		header: true,
		columns: [
			{ key: "id", header: "ID" },
			{ key: "original_url", header: "Original URL" },
			{ key: "short_url", header: "Short URL" },
			{ key: "number_of_clicks", header: "Access Count" },
			{ key: "created_at", header: "Created At" },
		],
	});

	const uploadToStorageStream = new PassThrough();

	const convertoToCSVPipeline = pipeline(
		cursor,
		new Transform({
			objectMode: true,
			transform(chunks: unknown[], encoding, callback) {
				for (const chunk of chunks) {
					this.push(chunk);
				}
				callback();
			},
		}),
		csv,
		uploadToStorageStream
	);

	const uploadToStorage = uploadFileToStorage({
		contentType: "text/csv",
		folder: "export",
		fileName: `${new Date().toISOString()}-report.csv`,
		contentStream: uploadToStorageStream,
	});

	const [{ url }] = await Promise.all([uploadToStorage, convertoToCSVPipeline]);

	return { reportUrl: url };
}
