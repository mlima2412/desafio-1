import { db } from "../../infra/db/index.ts";
import { schema } from "../../infra/db/schemas/index.ts";

export async function createLink(originalUrl: string, shortUrl: string | null) {
	if (shortUrl === null || shortUrl === "") {
		// gera um numero alfanumero de 6 digitos
		shortUrl = Math.random().toString(36).substring(2, 8);
	}
	console.log(
		"Creating link with originalUrl:",
		originalUrl,
		"and shortUrl:",
		shortUrl
	);

	const [inserted] = await db
		.insert(schema.links)
		.values({
			originalUrl,
			shortUrl,
		})
		.returning();

	return inserted.id;
}
