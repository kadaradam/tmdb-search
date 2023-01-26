import colors from '@/theme/colors';
import { TmdbConfigType, TrendingApiResponseType, TrendingType } from '@/types';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import React from 'react';
import useSWR, { Fetcher } from 'swr';
import clientSideAxios from '../instances/clientSideAxios';
import SearchItem from './SearchItem';

type RelatedItemsDrawerProps = {
	movie: TrendingType;
	drawerOpen: boolean;
	setDrawerOpen: React.Dispatch<React.SetStateAction<boolean>>;
	configuration: TmdbConfigType;
};

const fetcher: Fetcher<TrendingType[], string> = async (url) => {
	const { data } = await clientSideAxios.get<TrendingApiResponseType>(url);
	return data.results;
};

const RelatedItemsDrawer = ({
	movie,
	drawerOpen,
	setDrawerOpen,
	configuration,
}: RelatedItemsDrawerProps) => {
	const toggleDrawer =
		(open: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
			if (
				event.type === 'keydown' &&
				((event as React.KeyboardEvent).key === 'Tab' ||
					(event as React.KeyboardEvent).key === 'Shift')
			) {
				return;
			}

			setDrawerOpen(open);
		};

	const { data, isLoading } = useSWR(
		drawerOpen ? `/recommendations?movieId=${movie.id}` : null,
		fetcher
	);

	const isLoaded = !!data?.length;
	const isEmpty = data?.length === 0;
	const title = movie.original_title || movie.title;

	return (
		<Drawer anchor="right" open={drawerOpen} onClose={toggleDrawer(false)}>
			<Box p={3} width="300px">
				<Typography variant="h6" textAlign="center">
					Simmillar movies like:
				</Typography>
				<Typography variant="h6" textAlign="center" mb={4}>
					<strong>{title}</strong>
				</Typography>
				{!isLoaded && isLoading ? (
					<Box display="flex" justifyContent="center" mt={4}>
						<CircularProgress size={64} />
					</Box>
				) : null}
				{isEmpty ? (
					<Box
						display="flex"
						alignItems="center"
						flexDirection="column"
					>
						<SentimentVeryDissatisfiedIcon
							fontSize="large"
							sx={{ fill: colors.imdbYellow[50] }}
						/>
						<Typography variant="body1" textAlign="center" pt={2}>
							Wops. We couldn&apos;t find any related movie for
							&quot;
							<strong>{title}</strong>
							&quot;
						</Typography>
					</Box>
				) : null}
				{data?.map((item) => (
					<Box key={item.id} pb={4}>
						<SearchItem
							key={item.id}
							item={item}
							configuration={configuration}
						/>
					</Box>
				))}
			</Box>
		</Drawer>
	);
};

export default RelatedItemsDrawer;
