import { createLink } from "../../../app/services/create-link.ts";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const createLinkRoute: FastifyPluginAsyncZod = async (app) => {
	app.post(
		"/newlink",
		{
			schema: {
				summary: "Create a new short link",
				description:
					"This endpoint allows you to create a new short link. You need to provide an original URL and an custom short URL. If the custom short URL is not provided, a unique one will be generated.",
				body: z.object({
					// originalUrl is required, must be a valid URL
					originalUrl: z.string().url(),
					// shortUrl is optional, if not provided, a unique one will be generated
					shortUrl: z.string().url().max(20).nullable(),
				}),
				response: {
					201: z.object({
						link: z.object({
							urlId: z.string().uuid(),
						}),
					}),
					400: z
						.object({
							errors: z.array(
								z.object({
									name: z.string().describe("Field name"),
									error: z.string().describe("Error message"),
								})
							),
						})
						.describe("Validation errors"),

					409: z
						.object({
							message: z.string().describe("Error message"),
						})
						.describe("Conflict error, short link already exists"),
				},
			},
		},
		async (request, reply) => {
			try {
				// aqui começa a lógica de criação do usuário
				//const { originalUrl, shortUrl } = request.body;
				const urlId = await createLink(
					request.body.originalUrl,
					request.body.shortUrl ?? null
				);
				reply.status(201).send({
					link: {
						urlId: urlId,
					},
				});
			} catch (error) {
				console.log("Error creating link:", error);
				return reply.status(500).send({
					message: "Internal Server Error",
				});
			}
		}
	);
};
