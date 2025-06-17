import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { exportLinks } from "../../../app/services/export-links.ts";

export const exportToCSVRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/export-to-csv",
		{
			schema: {
				summary: "Export all registered links to CSV",
				description:
					"This endpoint allows you to export all registered links in CSV format. The response will include a link to download the CSV file.",

				querystring: z.object({
					searchQuery: z
						.string()
						.optional()
						.describe("Search query to filter links"),
				}),
				response: {
					200: z
						.object({
							url: z
								.string()
								.describe("CSV filename on cloudeflare public bucket"),
						})
						.describe("Link to download the CSV file"),
					500: z
						.object({
							error: z.string().describe("Failed to export links"),
						})
						.describe("Link to download the CSV file"),
				},
			},
		},
		async (request, reply) => {
			const { searchQuery } = request.query;
			const fileName: string = await exportLinks({ searchQuery });
			if (!fileName || fileName === "") {
				return reply.status(500).send({ error: "Failed to export links" });
			}
			reply.status(200).send({ url: fileName });
		}
	);
};
