import '@/components/styles/globals.css';
import createEmotionCache from '@/theme/createEmotionCache';
import { ThemeStateProvider } from '@/theme/ThemeStateProvider';
import { CacheProvider, EmotionCache } from '@emotion/react';
import CssBaseline from '@mui/material/CssBaseline';
import type { AppProps } from 'next/app';
import Head from 'next/head';

const clientSideEmotionCache = createEmotionCache();
interface MyAppProps extends AppProps {
	emotionCache?: EmotionCache;
}

export default function App({
	Component,
	emotionCache = clientSideEmotionCache,
	pageProps,
}: MyAppProps) {
	return (
		<CacheProvider value={emotionCache}>
			<Head>
				<meta
					name="viewport"
					content="initial-scale=1, width=device-width"
				/>
			</Head>
			<ThemeStateProvider>
				<CssBaseline />
				<Component {...pageProps} />
			</ThemeStateProvider>
		</CacheProvider>
	);
}
