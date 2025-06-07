import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const deleteLinkRoute: FastifyPluginAsyncZod = async (app) => {
	app.delete(
		"/link/:urlId",
		{
			schema: {
				summary: "Delete a short link",
				description:
					"Deletes a short link by its unique identifier. This operation removes the link from the database.",
				params: z.object({
					urlId: z
						.string()
						.uuid()
						.describe("Unique identifier of the link to delete"),
				}),
				response: {
					200: z
						.object({
							message: z.string().describe("Success message"),
						})
						.describe("Link deleted successfully"),
					404: z
						.object({
							message: z.string().describe("Error message"),
						})
						.describe("Link not found"),
				},
			},
		},
		(request) => {
			const { urlId } = request.params;
			// aqui começa a lógica de deleção do link
			return { message: "Link deleted successfully" };
		}
	);
};
