import { pgTable, text, timestamp, integer } from "drizzle-orm/pg-core";
import { uuidv7 } from "uuidv7";

export const links = pgTable("links", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => uuidv7()),
	originalUrl: text("original_url").notNull(),
	shortUrl: text("short_url").notNull().unique(),
	numberOfClicks: integer("number_of_clicks").default(0),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});
