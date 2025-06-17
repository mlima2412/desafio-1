import {
	DownloadIcon,
	LinkIcon,
	CopyIcon,
	TrashIcon,
} from "@phosphor-icons/react";
import { IconButton } from "./IconButton";
import { useEffect, useState } from "react";
import { Spinner } from "./Spinner";
import useAPI from "../hooks/useAPI";
import type { CardDataType } from "./carddata";
import useMessage from "../hooks/useMessage";
import { useLoading } from "../hooks/useLoading";
import { APIError } from "../error/APIError";

type Props = {
	reloadTrigger: boolean;
};

export function CardList({ reloadTrigger }: Props) {
	const { isLoading, setIsLoading } = useLoading();
	const [reloading, setReloading] = useState(false);
	const fileStoragePath = import.meta.env.VITE_CLOUDFLARE_PUBLIC_URL;

	const [data, setData] = useState<CardDataType[]>([]); // Inicializa o estado para armazenar os dados
	const { httpGet, httpDelete } = useAPI();
	const { success, fail } = useMessage();

	async function handleCSVDownload() {
		try {
			setIsLoading(true);
			setReloading(true);
			const { url } = await httpGet("export-to-csv");
			const a = document.createElement("a");
			a.href = fileStoragePath + url;
			a.download = url;
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			success("CSV baixado com sucesso!");
		} catch (error) {
			fail("Ocorreu um erro ao baixar o CSV.");
		} finally {
			setIsLoading(false);
			setReloading(false);
		}
	}

	function handleCopy(originalUrl: string) {
		navigator.clipboard
			.writeText(originalUrl)
			.then(() => {
				success("URL copiada para a área de transferência!");
			})
			.catch((err) => {
				console.error("Erro ao copiar a URL:", err);
			});
	}

	async function handleDelete(id: string) {
		try {
			setIsLoading(true);
			setReloading(true);
			const response = await httpDelete("delete", { id });
			setData((prevData) => prevData.filter((item) => item.id !== id));
			success("Link excluído com sucesso!");
		} catch (error) {
			console.error("Erro ao excluir o link:", error);
		} finally {
			setIsLoading(false);
		}
	}

	async function fetchData() {
		setIsLoading(true);
		setReloading(true);
		try {
			const response = await httpGet("links");
			setData(response.linkList);
		} catch (error) {
			console.error("Erro ao buscar dados:", error);
		} finally {
			setIsLoading(false);
			setReloading(false);
		}
	}

	useEffect(() => {
		const handleFocus = () => {
			fetchData(); // <- sua função de fetch dos links
		};

		window.addEventListener("focus", handleFocus);
		return () => window.removeEventListener("focus", handleFocus);
	}, [reloadTrigger]);

	useEffect(() => {
		fetchData();
	}, [reloadTrigger]);

	return (
		<div>
			<div className='relative flex justify-between items-center p-4 bg-white rounded-t-lg'>
				{isLoading && (
					<div
						className='absolute top-0 left-0 w-full h-1 
                 bg-gradient-to-r from-indigo-600 via-purple-400 to-indigo-600 
                 bg-[length:200%_100%] bg-no-repeat 
                 animate-loading-bar 
                 rounded-t'
					/>
				)}
				<span className='text-lg font-bold text-gray-600'>Meus Links</span>
				<IconButton
					icon={
						<DownloadIcon
							size={16}
							color='#4B5563'
							weight='bold'
						/>
					}
					reload={reloading}
					disabled={isLoading || data.length === 0}
					label='Baixar CSV'
					onClick={() => {
						handleCSVDownload();
					}}
				/>
			</div>

			<div className='min-w-[430px] min-h-[214px] max-h-[348px] md:min-w-[593px] md:min-h-[196px] md:max-h-[470px] overflow-y-auto px-4 py-4 bg-white rounded-b-lg'>
				{!reloading ? (
					data.length > 0 ? (
						// Renderiza os itens se houver dados
						<div className='flex flex-col'>
							{data.map((item) => (
								<div
									key={item.id}
									className='flex flex-row py-2 items-center justify-between bg-white gap-2 flex-wrap border-y border-gray-200'
								>
									<div className='flex-1'>
										<span className='text-blue_base font-medium'>
											<a
												href={`${window.location.origin}/${item.shortUrl}`}
												target='_blank'
												rel='noopener noreferrer'
											>
												brev.ly/{item.shortUrl}
											</a>
										</span>
										<p className='text-sm text-gray-600'>
											<a
												href={`${item.originalUrl}`}
												target='_blank'
												rel='noopener noreferrer'
											>
												{item.originalUrl}
											</a>
										</p>
									</div>

									{/* Coluna 2: Acessos */}
									<div className='text-sm text-gray-500 whitespace-nowrap'>
										{item.numberOfClicks} acessos
									</div>

									{/* Coluna 3: Ícones */}
									<div className='flex gap-0.5'>
										<IconButton
											icon={
												<CopyIcon
													size={16}
													color='#4B5563'
												/>
											}
											onClick={() => handleCopy(item.originalUrl)}
										/>
										<IconButton
											icon={
												<TrashIcon
													size={16}
													color='#4B5563'
												/>
											}
											onClick={() => {
												window.confirm(
													`Tem certeza que deseja excluir o link ${item.shortUrl}?`
												) && handleDelete(item.id);
											}}
										/>
									</div>
								</div>
							))}
						</div>
					) : (
						<div className='flex flex-col justify-center items-center h-28'>
							<LinkIcon
								size={32}
								color='text-gray-500'
							/>
							<span className='text-gray-500'>
								AINDA NÃO HÁ LINKS CADASTRADOS
							</span>
						</div>
					)
				) : (
					<div className='flex flex-col justify-center items-center h-28'>
						<Spinner />
						<span className='text-gray-500'>Aguarde, buscando links...</span>
					</div>
				)}
			</div>
		</div>
	);
}
