import StarIcon from '@mui/icons-material/Star';
import Box from '@mui/material/Box';
import Rating from '@mui/material/Rating';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/system';
import Image from 'next/image';
import { useState } from 'react';
import { TmdbConfigType, TrendingType } from '../types';

type SearchItemProps = {
	item: TrendingType;
	configuration: TmdbConfigType;
};

const SearchItem = ({ item, configuration }: SearchItemProps) => {
	const [imgSrc, setImgSrc] = useState<string>(
		`${configuration.images.secure_base_url}w300${item.poster_path}`
	);

	return (
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
					onError={() =>
						setImgSrc('/assets/default-fallback-image.png')
					}
				/>
			</Box>
			<Typography variant="h6" fontWeight="bold">
				{item.original_name || item.title}
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
		</AnimatedBox>
	);
};

const AnimatedBox = styled(Box)({
	'&:hover ': {
		transition: 'transform 450ms',
		transform: 'translateY(-10px)',
	},
});

export default SearchItem;
