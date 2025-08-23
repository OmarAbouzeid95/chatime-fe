'use client';
import {
	QueryClient,
	QueryClientProvider as QueryProivder,
} from '@tanstack/react-query';

const queryClient = new QueryClient();

export default function QueryClientProvider({
	children,
}: {
	children: React.ReactNode;
}) {
	return <QueryProivder client={queryClient}>{children}</QueryProivder>;
}
