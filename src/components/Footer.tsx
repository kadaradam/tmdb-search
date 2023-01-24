import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import Typography from '@mui/material/Typography';

const Footer = () => (
	<>
		<Divider />
		<Box component="footer" sx={{ bgcolor: '#0a0c0c' }}>
			<Container maxWidth="lg" component="main" sx={{ py: 7 }}>
				<Typography variant="h6" mb={2}>
					TMDB Search © {new Date().getFullYear()}
				</Typography>
				<Typography variant="body2">
					Crafted with ❤️ in Hungary
				</Typography>
			</Container>
		</Box>
	</>
);

export default Footer;
