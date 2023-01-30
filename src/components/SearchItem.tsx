import colors from '@/theme/colors';
import StarIcon from '@mui/icons-material/Star';
import { Button } from '@mui/material';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import Image from 'next/image';
import NextLink from 'next/link';
import { useState } from 'react';
import { FALLBACK_POSTER_IMG_PATH } from 'src/constants';
import { TmdbConfigType, TrendingType } from '../types';

type SearchItemProps = {
	item: TrendingType;
	configuration: TmdbConfigType;
	handleShowRelated?: (arg0: TrendingType) => void;
};

const SearchItem = ({
	item,
	configuration,
	handleShowRelated,
}: SearchItemProps) => {
	const [imgSrc, setImgSrc] = useState<string>(
		item.backdrop_path
			? `${configuration.images.secure_base_url}w300${item.poster_path}`
			: FALLBACK_POSTER_IMG_PATH
	);

	const handleRelatedClick = (e: React.MouseEvent) => {
		// Stop NextLink redirect click
		e.preventDefault();

		if (handleShowRelated) {
			handleShowRelated(item);
		}
	};

	return (
		<NextLink
			href={`/movie/${item.id}`}
			style={{ textDecoration: 'none', color: 'unset' }}
		>
			<AnimatedBox>
				<Box
					position="relative"
					sx={{
						width: '100%',
						height: '200px',
					}}
				>
					<Image
						src={imgSrc}
						alt={item.title}
						fill
						style={{
							objectFit: 'contain',
							margin: 'auto',
							overflow: 'hidden',
						}}
						sizes="(max-width: 768px) 100vw,
								(max-width: 1200px) 50vw,
								33vw"
						onError={() => setImgSrc(FALLBACK_POSTER_IMG_PATH)}
						placeholder="blur"
						blurDataURL={imgSrc}
					/>
				</Box>
				<Typography
					variant="h6"
					fontWeight="bold"
					className="movie-title"
				>
					{item.original_title || item.title}
				</Typography>
				<Typography variant="caption" textTransform="uppercase">
					{item.vote_count} votes
				</Typography>
				{item.vote_count > 0 ? (
					<Box>
						<Rating
							value={item.vote_average / 2}
							readOnly
							precision={0.5}
							size="small"
							emptyIcon={
								<StarIcon
									fontSize="inherit"
									sx={{ fill: 'white', opacity: 0.25 }}
								/>
							}
						/>
					</Box>
				) : null}
				{handleShowRelated ? (
					<Button onClick={handleRelatedClick} size="small">
						Show Related
					</Button>
				) : null}
			</AnimatedBox>
		</NextLink>
	);
};

const AnimatedBox = styled(Box)({
	'&:hover ': {
		transition: 'transform 450ms',
		transform: 'translateY(-10px)',
	},
	'&:hover > .movie-title': {
		color: colors.pictonBlue[50],
	},
});

export default SearchItem;
