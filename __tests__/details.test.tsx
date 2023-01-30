/* This test uses mocked REST endpoints */

import { assertHasProps, gsspCtx } from '@/utils';
import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import 'src/mock/setup';
import MovieDetails, { getServerSideProps } from 'src/pages/movie/[id]';

const MOVIE_ID = '343611';
const MOVIE_NAME = 'Jack Reacher: Never Go Back';

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

describe('Movie details', () => {
	beforeAll(async () => {
		const res = await getServerSideProps(
			gsspCtx({ params: { id: MOVIE_ID } })
		);

		assertHasProps(res);

		await act(() => render(<MovieDetails {...res.props} />));
	});

	it('renders movie title heading', async () => {
		const heading = screen.getByRole('heading', {
			name: new RegExp(MOVIE_NAME),
			level: 4,
		});

		expect(heading).toBeInTheDocument();
	});
});
