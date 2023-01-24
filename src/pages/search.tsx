import SearchItem from '@/components/SearchItem';
import SearchLayout from '@/layouts/SearchLayout';
import { TrendingApiResponseType, TrendingType } from '@/types/Trending.type';
import { LoadingButton } from '@mui/lab';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { Fetcher } from 'swr';
import useSWRInfinite from 'swr/infinite';
import clientSideAxios from '../instances/clientSideAxios';
import tmdbAxios from '../instances/tmdbAxios';
import { TmdbConfigType } from '../types';

export const getServerSideProps: GetServerSideProps<{
	configuration: TmdbConfigType;
}> = async () => {
	const { data: configuration } = await tmdbAxios.get<TmdbConfigType>(
		'/configuration'
	);

	return {
		props: {
			configuration,
		},
	};
};

// TMDB api always returns 20 items / page
const PAGE_SIZE = 20;

const fetcher: Fetcher<TrendingType[], string> = async (url) => {
	const { data } = await clientSideAxios.get<TrendingApiResponseType>(url);
	//await new Promise((resolve) => setTimeout(resolve, 2000));
	return data.results;
};

export default function Search({
	configuration,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();
	const { query } = router.query;
	const { data, error, size, setSize, isLoading, isValidating } =
		useSWRInfinite(
			(index) =>
				`/search?query=${encodeURI(query as string)}&page=${index + 1}`,
			fetcher
		);

	const movies = data ? data.flat() : [];
	const isEmpty = data?.[0]?.length === 0;
	const isLoaded = !!movies.length;
	const isLoadingInitialData = !data && !error;
	const isLoadingMore =
		isLoadingInitialData ||
		(isValidating &&
			size > 1 &&
			data &&
			typeof data[size - 1] === 'undefined');
	const isEndReached =
		isEmpty || (data && data[data.length - 1]?.length < PAGE_SIZE);

	return (
		<SearchLayout query={query as string}>
			<Typography variant="h4" fontWeight="bold" mb={3}>
				Results
			</Typography>
			{isEmpty ? (
				<Typography variant="h6" textAlign="center">
					Wops. We couldn&apos;t find any matches for &quot;
					<strong>{query}</strong>
					&quot;
				</Typography>
			) : null}
			<Grid container spacing={4}>
				{movies.map((item) => (
					<Grid item xs={6} sm={4} md={2} key={item.id}>
						<SearchItem item={item} configuration={configuration} />
					</Grid>
				))}
			</Grid>
			{!isLoaded && isLoading ? (
				<Box display="flex" justifyContent="center" mt={4}>
					<CircularProgress size={86} />
				</Box>
			) : null}
			{isLoaded && !isEndReached ? (
				<Box display="flex" justifyContent="center" mt={4}>
					<LoadingButton
						onClick={() => setSize((oldSize) => oldSize + 1)}
						variant="contained"
						size="large"
						loading={isLoadingMore}
					>
						Load more
					</LoadingButton>
				</Box>
			) : null}
		</SearchLayout>
	);
}
