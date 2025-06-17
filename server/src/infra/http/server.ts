import { fastify } from "fastify";
import { fastifyCors } from "@fastify/cors";
import { fastifySwagger } from "@fastify/swagger";
import scalarUI from "@scalar/fastify-api-reference";
import {
	hasZodFastifySchemaValidationErrors,
	jsonSchemaTransform,
	serializerCompiler,
	validatorCompiler,
} from "fastify-type-provider-zod";

import { healthCheckRoute } from "./routes/health-check.ts";
import { resolveLinkRoute } from "./routes/resolveLink.ts";
import { getLinksRoute } from "./routes/get-links-route.ts";
import { createLinkRoute } from "./routes/new-link.ts";
import { deleteLinkRoute } from "./routes/delete-link.ts";
import { exportToCSVRoute } from "./routes/export-to-csv.ts";
import { env } from "../../env.ts";

const server = fastify();

// validatorCompiler and serializerCompiler are used to compile Zod schemas for
// validation and serialization
// validator trata a validação dos dados de entrada
// serializer trata a serialização dos dados de saída
server.setValidatorCompiler(validatorCompiler);
server.setSerializerCompiler(serializerCompiler);

// Uma ajudinha para que o Zod formete melhor as mensagens de erro
// Eu vi um video do Diego sobre o novo Zod 4 que melhorou isso, mas
// creio que não vou usar isso aqui para não gerar um overhead de tempo
// de desenvolvimento. Eu não conheço ainda o Zod 4
server.setErrorHandler((error, request, reply) => {
	if (hasZodFastifySchemaValidationErrors(error)) {
		const formattedErrors = error.validation.map((err: any) => ({
			name: err.instancePath.replace("/", "") || "unknown",
			error: err.message,
		}));

		return reply.status(400).send({
			errors: formattedErrors,
		});
	}

	console.error(error);
	reply.status(500).send({ message: "Internal server error" });
});

// Alows any origin to access the server
server.register(fastifyCors, {
	origin: "*",
	methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
	credentials: false,
});

server.register(fastifySwagger, {
	openapi: {
		info: {
			title: "Desafio 1 - Rocketseat (Backend)",
			description: "Desafio 1 do curso de FastAPI da Rocketseat",
			version: "1.0.0",
		},
	},
	transform: jsonSchemaTransform,
});

// Register the routes
server.register(createLinkRoute);
server.register(getLinksRoute);
server.register(deleteLinkRoute);
server.register(exportToCSVRoute);
server.register(healthCheckRoute);
server.register(resolveLinkRoute);

server.get("/openapi.json", () => server.swagger());

// Achei melhor usar o conhecimento da última aula que foi sobre documentação
// e achei bem legal a interface do scalar-ui
server.register(scalarUI, {
	routePrefix: "/docs",
	configuration: {
		theme: "bluePlanet",
		layout: "modern",
	},
});

server.listen({ port: env.PORT }).then(() => {
	console.log("server is running on port ", env.PORT);
});
