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
					302: z
						.object({
							message: z.string().describe("Link resolved successfully"),
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
			console.log("Resolving short link:", request.params.shortUrl);
			console.log("Request params:", request.params);
			// Aqui você deve chamar o service que resolve o link curto
			try {
				const { shortUrl } = request.params;
				const originalUrl = await resolveShortLink(shortUrl);
				console.log(`Redirecting to original URL: ${originalUrl}`);
				//await reply.redirect(originalUrl), 302;
			} catch (error) {
				console.error("Error resolving short link:", error);
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
