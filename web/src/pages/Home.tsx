import { useForm } from "react-hook-form";
import { CardList } from "../components/CardList";
import { InputText } from "../components/InputText";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "../components/Button";
import useMessage from "../hooks/useMessage";

import logo from "../assets/logo.svg"; // Importando a imagem do logo
import { useLoading } from "../hooks/useLoading";
import useAPI from "../hooks/useAPI";
import { APIError } from "../error/APIError";
import { useState } from "react";
import { set } from "zod/v4-mini";

type FormData = {
	linkOriginal: string;
	linkEncurtado: string;
};

const linkSchema = z.object({
	linkOriginal: z.string().url({ message: "Informe um link válido" }),
	linkEncurtado: z
		.string()
		.min(5, { message: "Link encurtado deve ter pelo menos 5 caracteres" })
		.regex(/^[a-zA-Z0-9-]{6,}$/, {
			message: "Apenas letras, números e traços. Sem espaços ou símbolos.",
		}),
});
type LinkSchemaType = z.infer<typeof linkSchema>;

export function Home() {
	const { httpPost } = useAPI();
	const { fail, success } = useMessage();
	const { isLoading, setIsLoading } = useLoading();
	const [reloadLinks, setReloadLinks] = useState(false);
	const {
		register,
		handleSubmit,
		formState: { errors, isValid },
	} = useForm<LinkSchemaType>({
		resolver: zodResolver(linkSchema),
	});

	const onSubmit = async (data: FormData) => {
		setIsLoading(true);
		try {
			await httpPost("newlink", {
				originalUrl: data.linkOriginal,
				shortUrl: data.linkEncurtado,
			});
			setReloadLinks((prev) => !prev); // Alterna o estado para recarregar a lista de links
			success("Link encurtado criado com sucesso!");
		} catch (error) {
			if (error instanceof APIError) {
				if (error.status === 409) {
					fail("Link encurtado já existe");
				} else if (error.status === 400) {
					fail("Os dados estão incorretos");
				}
			} else {
				console.error("Erro inesperado:", error);
			}
		} finally {
			setIsLoading(false);
		}
	};

	return (
		<div>
			<div className='flex justify-center md:justify-start md:ml-44 mt:8 md:mt-8 p-4'>
				<img
					src={logo}
					alt='Logo'
					className='w-24 h-22 mb:6 md:mb-4'
				/>
			</div>
			<div className='flex flex-col md:flex-row items-center md:items-start w-full gap-2 md:ml-48'>
				<div className='min-w-[430px] min-h-[214px] md:min-w-[380px] md:max-w-[380px] md:min-h-[340px] bg-white rounded-lg p-6 md:px-8 md:pt-8 md:pb-6'>
					<div>
						<span className='text-lg font-bold text-gray-600'>Novo link</span>
					</div>
					<div>
						<form
							onSubmit={handleSubmit(onSubmit)}
							className='space-y-4'
						>
							<div>
								<InputText
									label='LINK ORIGINAL'
									name='linkOriginal'
									placeholder='https://www.exemplo.com'
									register={register}
									errorMessage={errors.linkOriginal?.message}
								/>
							</div>
							<div>
								<InputText
									label='LINK ENCURTADO'
									name='linkEncurtado'
									register={register}
									errorMessage={errors.linkEncurtado?.message}
									prefix='brev.ly/'
								/>
							</div>
							<div className='mt-4'>
								<Button
									disabled={isLoading}
									label='Salvar link'
									onSubmit={handleSubmit(onSubmit)}
								/>
							</div>
						</form>
					</div>
				</div>

				<div>
					<CardList reloadTrigger={reloadLinks} />
				</div>
			</div>
		</div>
	);
}
