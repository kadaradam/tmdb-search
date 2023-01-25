import SearchInput from '@/components/SearchInput';
import SearchItem from '@/components/SearchItem';
import HomeLayout from '@/layouts/HomeLayout';
import { TmdbConfigType, TrendingApiResponseType, TrendingType } from '@/types';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography, { TypographyProps } from '@mui/material/Typography';
import { styled } from '@mui/system';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import tmdbAxios from '../instances/tmdbAxios';

export const getServerSideProps: GetServerSideProps<{
	configuration: TmdbConfigType;
	trending: TrendingType[];
}> = async () => {
	const [{ data: trending }, { data: configuration }] = await Promise.all([
		tmdbAxios.get<TrendingApiResponseType>('/trending/movie/day'),
		tmdbAxios.get<TmdbConfigType>('/configuration'),
	]);

	return {
		props: {
			trending: trending.results,
			configuration,
		},
	};
};

export default function Home({
	trending,
	configuration,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const randomTrending =
		trending[Math.floor(Math.random() * trending.length)];

	const shortTrending = trending.slice(0, 12);

	return (
		<HomeLayout>
			<HeroBackgroundBox
				sx={{
					backgroundImage: `url(${configuration.images.secure_base_url}w1280${randomTrending.backdrop_path})`,
				}}
			>
				<OverlayBox />
				<WelcomeTypography>Welcome to TMDB Search.</WelcomeTypography>
				<SearchInput />
			</HeroBackgroundBox>
			<Container maxWidth="lg" sx={{ minHeight: '50vh', my: 5 }}>
				<Typography variant="h4" fontWeight="bold" mb={3}>
					Trending Movies
				</Typography>
				<Grid container spacing={4}>
					{shortTrending.map((item) => (
						<Grid item xs={6} sm={4} md={2} key={item.id}>
							<SearchItem
								item={item}
								configuration={configuration}
							/>
						</Grid>
					))}
				</Grid>
			</Container>
		</HomeLayout>
	);
}

const OverlayBox = styled(Box)({
	position: 'absolute',
	width: '100%',
	height: '100%',
	top: 0,
	bottom: 0,
	left: 0,
	right: 0,
	backgroundColor: 'rgba(255,255,255,0.2)',
});

const HeroBackgroundBox = styled(Box)({
	position: 'relative',
	minHeight: '50vh',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover',
	backgroundPosition: 'center',
});

const WelcomeTypography = styled((props: TypographyProps) => (
	<Typography variant="h2" {...props} />
))(({ theme }) => ({
	textShadow: '#0d0d0d 5px 0 10px',
	padding: theme.spacing(1),
	textAlign: 'center',
	width: '100%',
	marginBottom: theme.spacing(3),
	fontWeight: 'bold',
}));
