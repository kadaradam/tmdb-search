import MovieLayout from '@/layouts/MovieLayout';
import colors from '@/theme/colors';
import {
	MovieType,
	TmdbConfigType,
	WikipediaApiResponseType,
	WikipediaType,
} from '@/types';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import LinkIcon from '@mui/icons-material/Link';
import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import Stack, { StackProps } from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import axios from 'axios';
import { format, formatDuration } from 'date-fns';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import Image from 'next/image';
import NextLink from 'next/link';
import { ParsedUrlQuery } from 'querystring';
import { useState } from 'react';
import {
	FALLBACK_POSTER_IMG_PATH,
	IMDB_BASE_URL,
	WIKIPEDIA_API_BASE_URL,
	WIKIPEDIA_PAGE_BASE_URL,
} from 'src/constants';
import { ImdbIcon, WikipediaIcon } from 'src/icons';
import tmdbAxios from 'src/instances/tmdbAxios';

interface ParamsType extends ParsedUrlQuery {
	id: string;
}

const POSTER_SIZES = {
	mobile: {
		width: 108,
		height: 162,
	},
	desktop: {
		width: 205,
		height: 308,
	},
};
const ICON_SIZE = 40;

export const getServerSideProps: GetServerSideProps<{
	configuration: TmdbConfigType;
	movie: MovieType;
	wikipedia: WikipediaType | null;
}> = async ({ params }) => {
	try {
		const { id } = params as ParamsType;

		const [{ data: configuration }, { data: movie }] = await Promise.all([
			tmdbAxios.get<TmdbConfigType>('/configuration'),
			tmdbAxios.get<MovieType>(`/movie/${id}`),
		]);

		const title = movie.original_title || movie.title;

		const { data: wikipedia } = await axios.get<WikipediaApiResponseType>(
			`${WIKIPEDIA_API_BASE_URL}?format=json&action=query&prop=extracts&exintro&explaintext&redirects=1&titles=${encodeURI(
				title
			)}`,
			{
				headers: {
					'Content-Type': 'application/json',
				},
			}
		);

		const wikiPageFound = wikipedia && !wikipedia?.query.pages[-1];
		let wikipediaData: WikipediaType | null = null;

		if (wikiPageFound) {
			const wikiPageId = Object.keys(wikipedia.query.pages)[0];
			const wikiPage = wikipedia.query.pages[wikiPageId];

			wikipediaData = {
				pageId: wikiPage.pageid,
				summary: wikiPage.extract,
			};
		}

		return {
			props: {
				configuration,
				movie,
				wikipedia: wikipediaData,
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
	wikipedia,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const [imgSrc, setImgSrc] = useState<string>(
		movie.poster_path
			? `${configuration.images.secure_base_url}w1280${movie.poster_path}`
			: FALLBACK_POSTER_IMG_PATH
	);

	const title = movie.original_title || movie.title;
	const hasGenres = !!movie.genres.length;
	const hasWikiPage = !!wikipedia;

	return (
		<MovieLayout title={title}>
			<HeroBackgroundBox
				sx={{
					backgroundImage: movie.backdrop_path
						? `url(${configuration.images.secure_base_url}w1280${movie.backdrop_path})`
						: 'radial-gradient( circle farthest-corner at 10% 20%,  rgba(37,145,251,0.98) 0.1%, rgba(0,7,128,1) 99.8% )',
				}}
			/>
			<Container
				maxWidth="lg"
				sx={{ minHeight: '75vh', position: 'relative' }}
			>
				<LinkStack>
					{hasWikiPage ? (
						<Tooltip title="Open Wikipedia">
							<NextLink
								href={
									WIKIPEDIA_PAGE_BASE_URL + wikipedia.pageId
								}
								target="_blank"
								passHref
							>
								<IconButton
									aria-label="open wikipedia"
									component="label"
									disableRipple
								>
									<WikipediaIcon />
								</IconButton>
							</NextLink>
						</Tooltip>
					) : null}
					{movie.imdb_id ? (
						<Tooltip title="Open IMDB">
							<NextLink
								href={IMDB_BASE_URL + movie.imdb_id}
								target="_blank"
								passHref
								aria-label="imdb link"
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
								aria-label="homepage link"
							>
								<IconButton
									aria-label="open homepage"
									component="label"
									disableRipple
								>
									<LinkIcon />
								</IconButton>
							</NextLink>
						</Tooltip>
					) : null}
				</LinkStack>
				<Box display="flex" flexDirection="row" mb={2}>
					<PosterImgBox>
						<Image
							src={imgSrc}
							alt={title}
							fill
							sizes="(max-width: 768px) 100vw,
								(max-width: 1200px) 50vw,
								33vw"
							onError={() => setImgSrc(FALLBACK_POSTER_IMG_PATH)}
							style={{
								borderWidth: 3,
								borderStyle: 'solid',
								borderColor: '#1b2838',
							}}
							placeholder="blur"
							blurDataURL={imgSrc}
						/>
					</PosterImgBox>
					<Box mb={2} ml={3} mt={3} width="100%">
						<Typography variant="h4" fontWeight="bold">
							{title}
						</Typography>
						<Ul>
							{movie.release_date ? (
								<Li>
									<Typography variant="body2" gutterBottom>
										{format(
											new Date(movie.release_date),
											'yyyy'
										)}
									</Typography>
								</Li>
							) : null}
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
								{Number(movie.vote_average.toFixed(1))}
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
					<Typography variant="h6" gutterBottom>
						Overview by IMDB
					</Typography>
					<Typography variant="body1">{movie.overview}</Typography>
					{hasWikiPage ? (
						<Box mt={2}>
							<Typography variant="h6" gutterBottom>
								Overview by Wikipedia
							</Typography>
							<Typography variant="body1">
								{wikipedia.summary}
							</Typography>
						</Box>
					) : null}
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
	':not(:first-of-type):before ': {
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
	marginBottom: theme.spacing(5),
	position: 'relative',
	// Desktop
	[theme.breakpoints.up('sm')]: {
		top: `${(POSTER_SIZES['desktop'].height / 2) * -1}px`,
		marginTop: theme.spacing(5),
	},
	// Mobile
	[theme.breakpoints.down('sm')]: {
		top: `${(POSTER_SIZES['mobile'].height / 2) * -1}px`,
		marginTop: theme.spacing(10),
	},
}));

const LinkStack = styled((props: StackProps) => (
	<Stack direction="row" spacing={1} position="absolute" {...props} />
))(({ theme }) => ({
	...theme.unstable_sx({ bgcolor: 'background.default' }),
	right: theme.spacing(2),
	top: (ICON_SIZE + parseInt(theme.spacing(0.5 * 2))) * -1, // Icon size + padding bottom + pading top / 8 + 4 + 4
	borderRadius: '10px 10px 0px 0px',
	padding: theme.spacing(0.5),
}));

const PosterImgBox = styled(Box)(({ theme }) => ({
	position: 'relative',
	// Desktop
	[theme.breakpoints.up('sm')]: {
		height: POSTER_SIZES['desktop'].height,
		minWidth: POSTER_SIZES['desktop'].width,
		transform: `translateY(calc(${POSTER_SIZES['desktop'].height} / 2 * -1px))`,
	},
	// Mobile
	[theme.breakpoints.down('sm')]: {
		height: POSTER_SIZES['mobile'].height,
		minWidth: POSTER_SIZES['mobile'].width,
		transform: `translateY(calc(${POSTER_SIZES['mobile'].height} / 2 * -1px))`,
	},
}));
