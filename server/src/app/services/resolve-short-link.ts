import { eq } from "drizzle-orm";
import { db } from "../../infra/db/index.ts";
import { schema } from "../../infra/db/schemas/index.ts";
import { HttpError } from "../../app/services/errors/http-errors.ts";

export async function resolveShortLink(shortUrl: string): Promise<string> {
	console.log("Buscando por:", shortUrl);
	const result = await db
		.select({
			id: schema.links.id,
			originalUrl: schema.links.originalUrl,
			numberOfClicks: schema.links.numberOfClicks,
		})
		.from(schema.links)
		.where(eq(schema.links.shortUrl, shortUrl))
		.execute();

	const link = result[0];

	if (!link) {
		throw new HttpError(404, "Short URL not found");
	}

	// Incrementa o contador
	await db
		.update(schema.links)
		.set({ numberOfClicks: (link.numberOfClicks ?? 0) + 1 })
		.where(eq(schema.links.id, link.id))
		.execute();

	return link.originalUrl;
}
