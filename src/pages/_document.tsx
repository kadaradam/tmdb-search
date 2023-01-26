import createEmotionCache from '@/theme/createEmotionCache';
import theme from '@/theme/theme';
import { EmotionJSX } from '@emotion/react/types/jsx-namespace';
import createEmotionServer from '@emotion/server/create-instance';
import Document, {
	DocumentContext,
	DocumentInitialProps,
	Head,
	Html,
	Main,
	NextScript,
} from 'next/document';

interface DocumentProps extends DocumentInitialProps {
	emotionStyleTags: EmotionJSX.Element[];
}

const MyDocument = ({ emotionStyleTags }: DocumentProps) => {
	return (
		<Html lang="en">
			<Head>
				<meta name="theme-color" content={theme.palette.primary.main} />
				<meta
					name="description"
					content="Search for your favourite movies on TMDB"
				/>
				<link
					rel="apple-touch-icon"
					sizes="180x180"
					href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎬</text></svg>"
				/>
				<link
					rel="icon"
					href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>🎬</text></svg>"
				/>
				<meta name="emotion-insertion-point" content="" />
				{emotionStyleTags}
			</Head>
			<body>
				<Main />
				<NextScript />
			</body>
		</Html>
	);
};

export default MyDocument;

MyDocument.getInitialProps = async (ctx: DocumentContext) => {
	const originalRenderPage = ctx.renderPage;

	const cache = createEmotionCache();
	const { extractCriticalToChunks } = createEmotionServer(cache);

	ctx.renderPage = () =>
		originalRenderPage({
			enhanceApp: (App: any) =>
				function EnhanceApp(props) {
					return <App emotionCache={cache} {...props} />;
				},
		});

	const initialProps = await Document.getInitialProps(ctx);
	// This is important. It prevents Emotion to render invalid HTML.
	// See https://github.com/mui/material-ui/issues/26561#issuecomment-855286153
	const emotionStyles = extractCriticalToChunks(initialProps.html);
	const emotionStyleTags = emotionStyles.styles.map((style) => (
		<style
			data-emotion={`${style.key} ${style.ids.join(' ')}`}
			key={style.key}
			// eslint-disable-next-line react/no-danger
			dangerouslySetInnerHTML={{ __html: style.css }}
		/>
	));

	return {
		...initialProps,
		emotionStyleTags,
	};
};
