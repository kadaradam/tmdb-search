import Footer from '@/components/Footer';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MuiLink from '@mui/material/Link';
import Toolbar from '@mui/material/Toolbar';
import Head from 'next/head';
import React from 'react';

type SearchLayoutProps = {
	children: React.ReactNode;
};

const HomeLayout = ({ children }: SearchLayoutProps) => {
	return (
		<>
			<Head>
				<title>TMDB Search</title>
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
					</Toolbar>
				</Container>
			</AppBar>
			<Box component="main">{children}</Box>
			<Footer />
		</>
	);
};

export default HomeLayout;
