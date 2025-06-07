import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

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
			const { shortUrl } = request.params;
			// aqui começa a lógica de resolução do link
			// Exemplo fictício de resolução:
			const record = { originalUrl: "https://google.com" }; // Substitua pela lógica real
			if (record && record.originalUrl) {
				await reply.redirect(record.originalUrl), 302;
			} else {
				await reply.status(404).send({ message: "Link not found" });
			}
		}
	);
};
