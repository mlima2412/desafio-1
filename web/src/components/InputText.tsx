import { useState } from "react";
import { WarningIcon } from "@phosphor-icons/react";

interface InputTextProps {
	label: string;
	name: string;
	placeholder?: string;
	register: any;
	errorMessage?: string | null;
	prefix?: string;
}

export function InputText({
	label,
	name,
	placeholder = "",
	register,
	errorMessage,
	prefix = "",
}: InputTextProps) {
	const [isFocused, setIsFocused] = useState(false);
	const [hasValue, setHasValue] = useState(false);

	const handleFocus = () => {
		setIsFocused(true);
	};

	const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
		setIsFocused(false);
		setHasValue(!!e.target.value);
	};

	const hasError = !!errorMessage;

	// ✅ Sempre prioriza erro
	const labelColor = hasError
		? "text-danger"
		: isFocused
		? "text-blue-500"
		: "text-gray-500";

	const textColor = "text-gray-600 text-md";

	const borderColor = hasError
		? "!border-danger"
		: isFocused
		? "border-blue-500"
		: "border-gray-300";

	const borderWidth = hasError
		? "border-[1.5px]"
		: isFocused || hasValue
		? "border-[1.5px]"
		: "border";

	return (
		<div className='w-full mb-4'>
			<label
				htmlFor={name}
				className={`text-xs ${labelColor}`}
			>
				{label.toUpperCase()}
			</label>

			<div
				className={`
      mt-1 w-full px-2 py-1 rounded flex items-center 
      placeholder:text-gray-400 
      ${textColor} ${borderColor} ${borderWidth}
      transition-all duration-150
      ${
				hasError
					? "focus-within:!outline-none focus-within:!ring-0 focus-within:!border-danger"
					: "focus-within:outline-none focus-within:ring-2 focus-within:ring-blue-500/20 focus-within:border-blue-500"
			}
    `}
			>
				{prefix && (
					<span className='text-gray-500 text-sm select-none mr-1'>
						{prefix}
					</span>
				)}
				<input
					id={name}
					{...register(name)}
					placeholder={isFocused && !hasValue ? "" : placeholder}
					onFocus={handleFocus}
					onBlur={handleBlur}
					className='flex-1 border-none outline-none bg-transparent text-sm'
				/>
			</div>

			{hasError && (
				<span className='flex items-center gap-1 mt-1 text-xs text-gray-500'>
					<WarningIcon
						color='#FF0000'
						size={14}
						weight='bold'
					/>
					{errorMessage}
				</span>
			)}
		</div>
	);
}
