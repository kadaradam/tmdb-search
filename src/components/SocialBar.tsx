import colors from '@/theme/colors';
import LinkIcon from '@mui/icons-material/Link';
import IconButton from '@mui/material/IconButton';
import Stack, { StackProps } from '@mui/material/Stack';
import Tooltip from '@mui/material/Tooltip';
import { styled } from '@mui/system';
import NextLink from 'next/link';
import { ImdbIcon, WikipediaIcon } from 'src/icons';

type SocialBarProps = {
	wikipediaUrl: string | null;
	imdbUrl: string | null;
	homePageUrl: string | null;
};

const ICON_SIZE = 40;

const SocialBar = ({ wikipediaUrl, imdbUrl, homePageUrl }: SocialBarProps) => {
	return (
		<LinkStack>
			{wikipediaUrl ? (
				<Tooltip title="Open Wikipedia">
					<NextLink href={wikipediaUrl} target="_blank" passHref>
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
			{imdbUrl ? (
				<Tooltip title="Open IMDB">
					<NextLink
						href={imdbUrl}
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
			{homePageUrl ? (
				<Tooltip title="Open homepage">
					<NextLink
						href={homePageUrl}
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
	);
};

export default SocialBar;

const LinkStack = styled((props: StackProps) => (
	<Stack direction="row" spacing={1} position="absolute" {...props} />
))(({ theme }) => ({
	...theme.unstable_sx({ bgcolor: 'background.default' }),
	right: theme.spacing(2),
	top: (ICON_SIZE + parseInt(theme.spacing(0.5 * 2))) * -1, // Icon size + padding bottom + pading top / 8 + 4 + 4
	borderRadius: '10px 10px 0px 0px',
	padding: theme.spacing(0.5),
}));
