import type { CardDataType } from "./carddata";

interface CardListProps {
	data: CardDataType[];
}

export function CardList({ data }: CardListProps) {
	return (
		<div className='min-w-[366px] min-h-[214px] max-h-[348px] md:min-w-[598px] md:max-h-[600px] overflow-y-auto gap-20 px-4 py-4 bg-gray-100 rounded-lg'>
			<div className='flex flex-col gap-4'>
				{data.map((item) => (
					<div
						key={item.id}
						className='w-full bg-white shadow rounded-md p-4 min-h-[100px]'
					>
						<h3 className='text-blue_base font-medium'>{item.shortLink}</h3>
						<p className='text-sm text-gray-600'>
							brev.ly/{item.shortLink || "Sem descrição"}
						</p>
						<a
							href={`/${item.shortLink}`}
							className='text-blue-600 text-sm mt-2 inline-block'
						>
							Acessar
						</a>
					</div>
				))}
			</div>
		</div>
	);
}
