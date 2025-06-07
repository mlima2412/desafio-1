import { create } from "domain";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const getLinksRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/links",
		{
			schema: {
				summary: "Get all registered links",
				description:
					"This endpoint retrieves a paginated list of all registered short links. Each link includes its original URL, short URL, number of clicks, and creation date.",
				querystring: z.object({
					page: z.coerce.number().int().min(1).default(1),
				}),
				response: {
					200: z
						.object({
							linkList: z.array(
								z.object({
									urlId: z.string().uuid(),
									originalUrl: z.string().url(),
									shortUrl: z.string().url(),
									numberOfClicks: z.coerce.number().int(),
									createdAt: z.coerce.date(),
								})
							),
						})
						.describe("List of links with pagination"),
				},
			},
		},
		(request) => {
			return { linkList: [] };
		}
	);
};
