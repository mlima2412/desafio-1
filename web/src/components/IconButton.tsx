import { Spinner } from "./Spinner";

interface ButtonProps {
	label?: string;
	disabled?: boolean;
	icon?: React.ReactNode;
	onClick?: () => void;
}

export function IconButton({
	label,
	disabled = false,
	onClick,
	icon,
}: ButtonProps) {
	return (
		<button
			disabled={disabled}
			type='button'
			onClick={onClick}
			className={`
				flex items-center justify-center gap-2
				px-1 py-1
				border border-transparent
				bg-gray-200 rounded-md
				text-gray-500 text-xs
				hover:border-blue_base
				transition-colors
				${disabled ? "cursor-not-allowed opacity-50" : ""}
			`}
		>
			{icon && (
				<span className='flex items-center'>
					{disabled ? <Spinner /> : icon}
				</span>
			)}
			{label && <span>{label}</span>}
		</button>
	);
}
