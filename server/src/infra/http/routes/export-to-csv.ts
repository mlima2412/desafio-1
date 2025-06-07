import type { FastifyPluginAsyncZod } from "fastify-type-provider-zod";
import { z } from "zod";

export const exportToCSVRoute: FastifyPluginAsyncZod = async (app) => {
	app.get(
		"/export-to-csv",
		{
			schema: {
				summary: "Export all registered links to CSV",
				description:
					"This endpoint allows you to export all registered links in CSV format. The response will include a link to download the CSV file.",

				querystring: z.object({
					page: z.coerce.number().int().min(1).default(1),
				}),
				response: {
					200: z
						.object({
							exportLink: z
								.string()
								.url()
								.describe("Link to download the CSV file"),
						})
						.describe("Link to download the CSV file"),
				},
			},
		},
		(request) => {
			return { exportLink: "http://localhost:3333/links.csv" };
		}
	);
};
