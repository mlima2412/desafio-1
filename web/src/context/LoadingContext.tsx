// contexts/LoadingContext.tsx
import { createContext, useState } from "react";
import type { ReactNode } from "react";

interface LoadingContextType {
	isLoading: boolean;
	setIsLoading: (value: boolean) => void;
}

export const LoadingContext = createContext<LoadingContextType | undefined>(
	undefined
);

export function LoadingProvider({ children }: { children: ReactNode }) {
	const [isLoading, setIsLoading] = useState(false);

	return (
		<LoadingContext.Provider value={{ isLoading, setIsLoading }}>
			{children}
		</LoadingContext.Provider>
	);
}
