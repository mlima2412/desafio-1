import { z } from "zod";
import { db, pg } from "../../infra/db/index.ts";
import { schema } from "../../infra/db/schemas/index.ts";

const getLinksInput = z.object({
	searchQuery: z.string().optional(),
});
type GetLinksInput = z.input<typeof getLinksInput>;
type GetLinksOutput = {
	linkList: Array<{
		id: string;
		originalUrl: string;
		shortUrl: string;
		numberOfClicks: number;
		createdAt: Date;
	}>;
};
export async function getLinks({
	searchQuery,
}: GetLinksInput): Promise<GetLinksOutput> {
	const links = await getLinkListFromDB();
	if (searchQuery) {
		const query = searchQuery.toLowerCase();
		const filteredLinks = links.filter(
			(link) =>
				link.originalUrl.includes(query) || link.shortUrl.includes(query)
		);
		return { linkList: filteredLinks };
	}
	return { linkList: links };
}

async function getLinkListFromDB(): Promise<GetLinksOutput["linkList"]> {
	const { sql, params } = db
		.select({
			id: schema.links.id,
			originalUrl: schema.links.originalUrl,
			shortUrl: schema.links.shortUrl,
			numberOfClicks: schema.links.numberOfClicks,
			createdAt: schema.links.createdAt,
		})
		.from(schema.links)
		.toSQL();

	const cursor = pg.unsafe(sql, params as string[]).cursor(2);
	const linkList: GetLinksOutput["linkList"] = [];
	for await (const rows of cursor) {
		for (const row of rows) {
			linkList.push({
				id: row.id,
				originalUrl: row.original_url,
				shortUrl: row.short_url,
				numberOfClicks: row.number_of_clicks,
				createdAt: row.created_at,
			});
		}
	}
	return linkList;
}
