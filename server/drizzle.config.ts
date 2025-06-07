import { env } from "./src/env.ts";
import type { Config } from "drizzle-kit";

export default {
	dbCredentials: {
		url: env.DATABASE_URL,
	},
	dialect: "postgresql",
	schema: "src/infra/db/schemas/*",
	out: "src/infra/db/migrations",
} satisfies Config;
