import Footer from '@/components/Footer';
import SearchInput from '@/components/SearchInput';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MuiLink from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';

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
			<Footer />
		</>
	);
};

export default SearchLayout;
