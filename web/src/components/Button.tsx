interface ButtonProps {
	label: string;
	disabled?: boolean;
	onClick?: () => void;
	onSubmit?: () => void;
}

export function Button({
	label,
	disabled = false,
	onClick,
	onSubmit,
}: ButtonProps) {
	return (
		<button
			disabled={disabled}
			type='submit'
			className={`w-full bg-blue_base ${
				disabled ? "cursor-not-allowed bg-opacity-50" : "hover:bg-blue_dark"
			} text-white py-2 rounded-md transition-colors`}
		>
			<span className='text-md text-white'>{label}</span>
		</button>
	);
}
