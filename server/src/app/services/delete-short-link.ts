import { eq } from "drizzle-orm";
import { db } from "../../infra/db/index.ts";
import { schema } from "../../infra/db/schemas/index.ts";
import { HttpError } from "./errors/http-errors.ts";

export async function deleteShortLink(id: string): Promise<boolean> {
	// deletar um registro do banco baseado no id recebido

	const result = await db
		.delete(schema.links)
		.where(eq(schema.links.id, id))
		.returning({ id: schema.links.id }) // Retorna só o ID deletado
		.execute();

	if (result.length === 0) {
		throw new HttpError(404, "Link not found");
	}

	return true;
}
