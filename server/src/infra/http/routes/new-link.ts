import { createLink } from "../../../app/services/create-link.ts";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { HttpError } from "../../../app/services/errors/http-errors.ts";

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
					originalUrl: z
						.string()
						.url()
						.describe("Original URL to be shortened"),
					shortUrl: z
						.string()
						.nullable()
						.optional()
						.describe("Custom short URL"),
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
					request.body.shortUrl ?? ""
				);
				reply.status(201).send({
					link: {
						urlId: urlId,
					},
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
