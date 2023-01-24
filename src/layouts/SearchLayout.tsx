import SearchInput from '@/components/SearchInput';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Divider from '@mui/material/Divider';
import MuiLink from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

import Head from 'next/head';
import React from 'react';

type SearchLayoutProps = {
	query: string | undefined;
	children: React.ReactNode;
};

const SearchLayout = ({ children, query }: SearchLayoutProps) => {
	return (
		<>
			<Head>
				<title>
					{query ? query + ' - TMDB Search' : 'TMDB Search'}
				</title>
			</Head>
			<AppBar position="static">
				<Container maxWidth="lg">
					<Toolbar component="nav" variant="dense">
						<MuiLink
							href="/"
							variant="h5"
							underline="none"
							sx={{ textDecoration: 'none', color: 'unset' }}
						>
							TMDB Search
						</MuiLink>
						<Box flexGrow={1} />
						<SearchInput />
					</Toolbar>
				</Container>
			</AppBar>
			<Container
				maxWidth="lg"
				component="main"
				sx={{ minHeight: '100vh', my: 5 }}
			>
				{children}
			</Container>
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
};

export default SearchLayout;
