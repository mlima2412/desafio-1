import { useCallback } from "react";
import { APIError } from "../error/APIError";

const URL_BASE = import.meta.env.VITE_API_URL;

if (!URL_BASE || URL_BASE === "" || URL_BASE === "undefined") {
	throw new Error("A variável de ambiente VITE_API_URL não está definida.");
}

export default function useAPI() {
	const getBaseURL = () => {
		if (typeof window !== "undefined") {
			const { hostname } = window.location;
			return import.meta.env.VITE_API_URL || `http://${hostname}:3000`;
		}
		return URL_BASE;
	};

	const httpGet = useCallback(async function (uri: string): Promise<any> {
		const res = await fetch(`${getBaseURL()}/${uri}`, {
			headers: { "Content-Type": "application/json" },
		});

		const data = await res.json();

		if (!res.ok) {
			throw new APIError(
				res.status,
				data?.message || "Erro desconhecido",
				data
			);
		}

		return data;
	}, []);

	const httpPost = useCallback(async function (
		uri: string,
		body: any
	): Promise<any> {
		const res = await fetch(`${getBaseURL()}/${uri}`, {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		const data = await res.json();

		if (!res.ok) {
			throw new APIError(res.status, data?.message || "Erro no POST", data);
		}

		return data;
	},
	[]);

	const httpDelete = useCallback(async function (
		uri: string,
		body: any
	): Promise<any> {
		const res = await fetch(`${getBaseURL()}/${uri}`, {
			method: "DELETE",
			headers: {
				"Content-Type": "application/json",
			},
			body: JSON.stringify(body),
		});

		const data = await res.json();

		if (!res.ok) {
			throw new APIError(
				res.status,
				data?.message || "Erro desconhecido",
				data
			);
		}

		return data;
	},
	[]);

	return { httpGet, httpPost, httpDelete };
}
