import MovieLayout from '@/layouts/MovieLayout';
import colors from '@/theme/colors';
import { MovieType, TmdbConfigType } from '@/types';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LinkIcon from '@mui/icons-material/Link';
import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import { format, formatDuration } from 'date-fns';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import { useState } from 'react';
import { IMDB_BASE_URL } from 'src/constants';
import { ImdbIcon } from 'src/icons';
import tmdbAxios from 'src/instances/tmdbAxios';

interface ParamsType extends ParsedUrlQuery {
	id: string;
}

const POSTER_HEIGHT = 308;

export const getServerSideProps: GetServerSideProps<{
	configuration: TmdbConfigType;
	movie: MovieType;
}> = async ({ params }) => {
	try {
		const { id } = params as ParamsType;

		const [{ data: configuration }, { data: movie, status: movieStatus }] =
			await Promise.all([
				tmdbAxios.get<TmdbConfigType>('/configuration'),
				tmdbAxios.get<MovieType>(`/movie/${id}`),
			]);

		return {
			props: {
				configuration,
				movie,
			},
		};
	} catch (err) {
		return {
			notFound: true,
		};
	}
};

export default function MovieDetails({
	configuration,
	movie,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();
	const [imgSrc, setImgSrc] = useState<string>(
		`${configuration.images.secure_base_url}w1280${movie.poster_path}`
	);

	const title = movie.original_title || movie.title;
	const hasGenres = !!movie.genres.length;

	return (
		<MovieLayout title={title}>
			<HeroBackgroundBox
				sx={{
					backgroundImage: `url(${configuration.images.secure_base_url}w1280${movie.backdrop_path})`,
				}}
			/>
			<Container maxWidth="lg" sx={{ minHeight: '75vh' }}>
				<Box display="flex" flexDirection="row" mb={2}>
					<Image
						src={imgSrc}
						alt={title}
						height={POSTER_HEIGHT}
						width={205}
						onError={() =>
							setImgSrc('/assets/default-fallback-image.png')
						}
						style={{
							display: 'inline-block',
							borderWidth: 3,
							borderStyle: 'solid',
							borderColor: '#1b2838',
							transform: `translateY(calc(${POSTER_HEIGHT} / 2 * -1px))`,
						}}
					/>
					<Box mb={2} ml={3} mt={3} width="100%">
						<Stack direction="row" spacing={1}>
							<Typography variant="h4" fontWeight="bold">
								{title}
							</Typography>
							<Box flexGrow={1} />
							{movie.imdb_id ? (
								<Tooltip title="Open IMDB">
									<NextLink
										href={IMDB_BASE_URL + movie.imdb_id}
										target="_blank"
										passHref
									>
										<IconButton
											aria-label="open imdb"
											component="label"
											disableRipple
										>
											<ImdbIcon
												sx={{
													fill: colors.imdbYellow[50],
												}}
												fontSize="large"
											/>
										</IconButton>
									</NextLink>
								</Tooltip>
							) : null}
							{movie.homepage ? (
								<Tooltip title="Open homepage">
									<NextLink
										href={movie.homepage}
										target="_blank"
										passHref
									>
										<IconButton
											aria-label="open homepage"
											component="label"
											disableRipple
										>
											<LinkIcon fontSize="large" />
										</IconButton>
									</NextLink>
								</Tooltip>
							) : null}
						</Stack>
						<Ul>
							<Li>
								<Typography variant="body2" gutterBottom>
									{format(
										new Date(movie.release_date),
										'yyyy'
									)}
								</Typography>
							</Li>
							{movie.runtime ? (
								<Li>
									<Typography variant="body2" gutterBottom>
										{formatDuration({
											minutes: movie.runtime,
										})}
									</Typography>
								</Li>
							) : null}
						</Ul>

						<Box
							display="flex"
							flexDirection="row"
							alignItems="center"
						>
							<Tooltip title="Rating" placement="top">
								<StarIcon
									fontSize="large"
									sx={{ fill: colors.starYellow[50] }}
								/>
							</Tooltip>
							<Typography variant="body1" ml={1} mr={2}>
								{movie.vote_average}
							</Typography>
							<Tooltip title="Revenue" placement="top">
								<AttachMoneyIcon
									fontSize="large"
									sx={{ fill: '#85bb65' }}
								/>
							</Tooltip>
							<Typography variant="body1">
								{movie.revenue} USD
							</Typography>
						</Box>
						{hasGenres ? (
							<Stack direction="row" spacing={1} mt={2}>
								{movie.genres.map((genre) => (
									<Chip key={genre.id} label={genre.name} />
								))}
							</Stack>
						) : null}
					</Box>
				</Box>
				<ContentBox>
					<Typography variant="h6">Overview</Typography>
					<Typography variant="body1">{movie.overview}</Typography>
				</ContentBox>
			</Container>
		</MovieLayout>
	);
}

const HeroBackgroundBox = styled(Box)({
	position: 'relative',
	minHeight: '25vh',
	display: 'flex',
	flexDirection: 'column',
	alignItems: 'center',
	justifyContent: 'center',
	backgroundRepeat: 'no-repeat',
	backgroundSize: 'cover',
	backgroundPosition: 'center',
});

const Li = styled('li')(({ theme }) => ({
	display: 'inline-block',
	verticalAlign: 'middle',
	':not(:first-child):before ': {
		display: 'inline-block',
		content: '"•"',
		fontSize: '80%',
		marginLeft: theme.spacing(1),
		marginRight: theme.spacing(1),
	},
	'> p': {
		display: 'inline-block',
	},
}));

const Ul = styled('ul')({
	padding: 'unset',
	margin: 'unset',
});

const ContentBox = styled(Box)(({ theme }) => ({
	marginTop: `${(POSTER_HEIGHT / 2 - parseInt(theme.spacing(2))) * -1}px`,
}));
