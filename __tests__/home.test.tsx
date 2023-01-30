/* This test uses mocked REST endpoints */

import { MovieListItemType, TmdbConfigType } from '@/types';
import { assertHasProps, gsspCtx } from '@/utils';
import '@testing-library/jest-dom';
import { render, screen, within } from '@testing-library/react';
import 'src/mock/setup';
import Home, { getServerSideProps } from 'src/pages';

const RELATED_ITEM_SIZE = 12;

const push = jest.fn();
jest.mock('next/router', () => ({
	useRouter() {
		return {
			route: '/',
			pathname: '',
			query: '',
			asPath: '',
			push,
			events: {
				on: jest.fn(),
				off: jest.fn(),
			},
			beforePopState: jest.fn(() => null),
			prefetch: jest.fn(() => null),
		};
	},
}));

describe('Home', () => {
	let props = null as unknown as {
		configuration: TmdbConfigType;
		trending: MovieListItemType[];
		randomTrending: MovieListItemType;
	};

	beforeAll(async () => {
		const res = await getServerSideProps(gsspCtx());
		assertHasProps(res);

		props = res.props;
	});

	it('renders welcome message header', async () => {
		render(<Home {...props} />);

		const heading = screen.getByRole('heading', {
			name: /Welcome to TMDB Search./i,
			level: 2,
		});

		expect(heading).toBeInTheDocument();
	});

	it('renders trending items', async () => {
		render(<Home {...props} />);

		const heading = screen.getByRole('heading', {
			name: /Trending Movies/i,
			level: 4,
		});

		const list = screen.getByTestId('trending-list');

		const { getAllByRole } = within(list);

		const items = getAllByRole('heading', {
			level: 6,
		});

		expect(heading).toBeInTheDocument();
		expect(items.length).toBe(RELATED_ITEM_SIZE);
	});

	it('renders trending items', async () => {
		render(<Home {...props} />);

		const randomTrendingIndex = Math.floor(
			Math.random() * props.trending.length
		);
		const randomTrending = props.trending[randomTrendingIndex];

		const list = screen.getByTestId('trending-list');

		const { getAllByRole } = within(list);

		const items = getAllByRole('link');
		const randomItem = items[randomTrendingIndex];

		expect(randomItem).toHaveAttribute(
			'href',
			`/movie/${randomTrending.id}`
		);
	});

	it('renders footer', async () => {
		render(<Home {...props} />);

		const footer = screen.getByRole('heading', {
			name: new RegExp(`TMDB Search © ${new Date().getFullYear()}`),
			level: 6,
		});

		expect(footer).toBeInTheDocument();
	});
});
