import { create } from "domain";
import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getLinks } from "../../../app/services/link-list.ts";

export const getLinksRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/links",
		{
			schema: {
				summary: "Get all registered links",
				description:
					"This endpoint retrieves a paginated list of all registered short links. Each link includes its original URL, short URL, number of clicks, and creation date.",
				querystring: z.object({
					searchQuery: z.string().optional(),
				}),
				response: {
					200: z
						.object({
							linkList: z.array(
								z.object({
									id: z.string().uuid(),
									originalUrl: z.string().url(),
									shortUrl: z.string(),
									numberOfClicks: z.coerce.number().int(),
									createdAt: z.coerce.date(),
								})
							),
						})
						.describe("List of links with pagination"),
				},
			},
		},
		async (request) => {
			const links = await getLinks(request.query);
			return { linkList: Array.isArray(links) ? links : links.linkList };
		}
	);
};
