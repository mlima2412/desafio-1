import { eq } from "drizzle-orm";
import { db } from "../../infra/db/index.ts";
import { schema } from "../../infra/db/schemas/index.ts";
import { HttpError } from "./errors/http-errors.ts";

async function isShortUrlExists(shortUrl: string): Promise<boolean> {
	const existingLinkArr = await db
		.select({ id: schema.links.id })
		.from(schema.links)
		.where(eq(schema.links.shortUrl, shortUrl.toLowerCase()))
		.execute();

	return existingLinkArr.length > 0;
}

export async function createLink(originalUrl: string, shortUrl: string | null) {
	if (shortUrl === null || shortUrl === "") {
		do {
			shortUrl = Math.random().toString(36).substring(2, 8);
		} while (await isShortUrlExists(shortUrl));
	} else {
		// Check if the provided short URL already exists
		const urlExist = await isShortUrlExists(shortUrl);
		if (urlExist) {
			throw new HttpError(409, "Short URL already exists");
		}
	}

	const [inserted] = await db
		.insert(schema.links)
		.values({
			originalUrl: originalUrl.toLowerCase(),
			shortUrl: shortUrl.toLowerCase(),
		})
		.returning();

	return inserted.id;
}
