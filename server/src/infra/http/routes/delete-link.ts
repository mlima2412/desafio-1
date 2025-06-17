import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { deleteShortLink } from "../../../app/services/delete-short-link.ts";
import { HttpError } from "../../../app/services/errors/http-errors.ts";

export const deleteLinkRoute: FastifyPluginAsyncZod = async (app) => {
	app.delete(
		"/delete",
		{
			schema: {
				summary: "Delete a short link",
				description:
					"Deletes a short link by its unique identifier. This operation removes the link from the database.",
				body: z.object({
					id: z
						.string()
						.uuid()
						.describe("Unique identifier of the link to delete"),
				}),
				response: {
					201: z
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
		async (request, reply) => {
			try {
				const id = request.body.id;
				const result = await deleteShortLink(id);
				if (result === false) {
					return reply.status(404).send({
						message: "Link not found",
					});
				}
				reply.status(201).send({
					message: "Link deleted successfully",
				});
			} catch (error) {
				if (error instanceof HttpError) {
					return reply.status(error.statusCode).send({
						message: error.message,
					});
				}
				return reply.status(500).send({
					message: "Internal Server Error",
				});
			}
		}
	);
};
