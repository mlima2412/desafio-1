import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { resolve } from "path";
import { z } from "zod";
import { resolveShortLink } from "../../../app/services/resolve-short-link.ts";
import { HttpError } from "../../../app/services/errors/http-errors.ts";

export const resolveLinkRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/resolve/:shortUrl",
		{
			schema: {
				summary: "Resolve a short link",
				description: "Resolves a short link to its original URL and redirects.",
				params: z.object({
					shortUrl: z
						.string()
						.describe("Unique identifier of the link to resolve"),
				}),
				response: {
					200: z
						.object({
							message: z.string().describe("Link resolved successfully"),
							originalUrl: z
								.string()
								.url()
								.describe("The original URL resolved from the short link"),
						})
						.describe("Link resolved successfully"),
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
				const { shortUrl } = request.params;
				const originalUrl = await resolveShortLink(shortUrl);
				`Redirecting to original URL: ${originalUrl}`;
				// returnar o link para o front-end sem redirecionar. QUem redireciona é o front-end
				return reply.status(200).send({
					message: "Link resolved successfully",
					originalUrl: originalUrl,
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
