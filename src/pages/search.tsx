import RelatedItemsDrawer from '@/components/RelatedItemsDrawer';
import SearchItem from '@/components/SearchItem';
import SearchLayout from '@/layouts/SearchLayout';
import { MovieListItemApiResponseType, MovieListItemType } from '@/types';
import LoadingButton from '@mui/lab/LoadingButton';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { useState } from 'react';
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

const fetcher: Fetcher<MovieListItemType[], string> = async (url) => {
	const { data } = await clientSideAxios.get<MovieListItemApiResponseType>(
		url
	);
	//await new Promise((resolve) => setTimeout(resolve, 2000));
	return data.results;
};

export default function Search({
	configuration,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();
	const { query } = router.query;
	const [drawerOpen, setDrawerOpen] = useState<boolean>(false);
	const [selectedMovie, setSelectedMovie] =
		useState<MovieListItemType | null>(null);
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

	const handleShowRelated = (movieItem: MovieListItemType) => {
		setSelectedMovie(movieItem);
		setTimeout(() => setDrawerOpen(true), 250);
	};

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
			{!isEmpty && !!movies.length ? (
				<Grid container spacing={4} data-testid="search-list">
					{movies.map((item) => (
						<Grid item xs={6} sm={4} md={2} key={item.id}>
							<SearchItem
								item={item}
								configuration={configuration}
								handleShowRelated={handleShowRelated}
							/>
						</Grid>
					))}
				</Grid>
			) : null}
			{!isLoaded && isLoading ? (
				<Box display="flex" justifyContent="center" mt={4}>
					<CircularProgress size={86} aria-label="search loading" />
				</Box>
			) : null}
			{isLoaded && !isEndReached ? (
				<Box display="flex" justifyContent="center" mt={4}>
					<LoadingButton
						onClick={() => setSize((oldSize) => oldSize + 1)}
						variant="contained"
						size="large"
						loading={isLoadingMore}
						data-testid="search load more"
					>
						Load more
					</LoadingButton>
				</Box>
			) : null}
			{selectedMovie ? (
				<RelatedItemsDrawer
					movie={selectedMovie}
					drawerOpen={drawerOpen}
					setDrawerOpen={setDrawerOpen}
					configuration={configuration}
				/>
			) : null}
		</SearchLayout>
	);
}
