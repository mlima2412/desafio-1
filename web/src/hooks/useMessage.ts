import { useCallback } from "react";
import { Flip, toast, Zoom } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function useMessage() {
	const success = useCallback((message: string) => {
		toast.success(message);
	}, []);

	const fail = useCallback((message: string) => {
		toast.error(message);
	}, []);

	const info = useCallback((message: string) => {
		toast.info(message, {
			transition: Flip,
		});
	}, []);

	const warning = useCallback((message: string) => {
		toast.warn(message, {
			position: "top-center",
			transition: Zoom,
		});
	}, []);

	const done = useCallback((message: string) => {
		toast.done(message);
	}, []);

	const promise = useCallback(
		async (
			promise: Promise<any>,
			messages: {
				pending?: string;
				success?: string;
				error?: string;
			}
		) => {
			await toast.promise(promise, {
				pending: messages.pending || "Processando requisição... ⏳",
				success: messages.success || "Tudo certo por aqui! 🎉",
				error: {
					render({ data }: any) {
						if (Array.isArray(data.errors)) {
							data.errors.forEach((error: any, i: number) => {
								if (i === 0) return;
								toast.error(error.message);
							});
							return data.errors[0].message;
						}
						return messages.error || "Ocorreu um erro inesperado.💥";
					},
				},
			});
		},
		[]
	);

	return { success, fail, promise, info, done, warning };
}
