import { scrollData } from "../components/carddata";
import { CardList } from "../components/CardList";

export function Home() {
	return (
		<div className='flex flex-col md:flex-row items-center md:items-start justify-center w-full p-4 gap-4'>
			{/* Coluna esquerda */}
			<div className='min-w-[366px] min-h-[214px] md:min-w-[380px] md:min-h-[340px] px-4 bg-gray-100 rounded-lg'>
				<h1 className='text-4xl font-bold text-gray-600'>Hello Brev.ly</h1>
				<p className='mt-4 text-dager'>Welcome to your Brev.ly application!</p>
			</div>

			<div>
				<CardList data={scrollData} />
			</div>
		</div>
	);
}
