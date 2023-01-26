import colors from '@/theme/colors';
import { TmdbConfigType, TrendingApiResponseType, TrendingType } from '@/types';
import SentimentVeryDissatisfiedIcon from '@mui/icons-material/SentimentVeryDissatisfied';
import { useMediaQuery } from '@mui/material';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import { grey } from '@mui/material/colors';
import { styled, useTheme } from '@mui/material/styles';
import SwipeableDrawer from '@mui/material/SwipeableDrawer';
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

const DRAWER_BLEEDING = 56;

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
	const theme = useTheme();
	const isOnMobile = useMediaQuery(theme.breakpoints.down('sm'));

	const toggleDrawer = (open: boolean) => () => {
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
		<SwipeableDrawer
			onOpen={toggleDrawer(true)}
			anchor={isOnMobile ? 'bottom' : 'right'}
			open={drawerOpen}
			onClose={toggleDrawer(false)}
			swipeAreaWidth={DRAWER_BLEEDING}
			disableSwipeToOpen={false}
			PaperProps={
				isOnMobile
					? {
							square: false,
							sx: { height: `calc(75% - ${DRAWER_BLEEDING}px)` },
					  }
					: { sx: { width: 400 } }
			}
		>
			<Box>
				<Puller />
				<Typography variant="h6" textAlign="center">
					Simmillar movies like:
				</Typography>
				<Typography variant="h6" textAlign="center" pb={2}>
					<strong>{title}</strong>
				</Typography>
			</Box>
			<ContentBox>
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
				<Box display="flex" flexDirection="column" alignItems="center">
					{data?.map((item) => (
						<Box key={item.id} pb={4} width={200}>
							<SearchItem
								key={item.id}
								item={item}
								configuration={configuration}
							/>
						</Box>
					))}
				</Box>
			</ContentBox>
		</SwipeableDrawer>
	);
};

export default RelatedItemsDrawer;

const Puller = styled(Box)(({ theme }) => ({
	// Desktop
	[theme.breakpoints.up('sm')]: {
		marginTop: theme.spacing(4),
	},
	// Mobile
	[theme.breakpoints.down('sm')]: {
		width: 30,
		height: 6,
		backgroundColor: theme.palette.mode === 'light' ? grey[900] : grey[300],
		borderRadius: 3,
		marginTop: theme.spacing(2),
		marginBottom: theme.spacing(2),
		marginLeft: 'auto',
		marginRight: 'auto',
		left: 'calc(50% - 15px)',
	},
}));

const ContentBox = styled(Box)(({ theme }) => ({
	...theme.unstable_sx({ px: 2, pb: 2 }),
	height: '100%',
	overflow: 'auto',
}));
