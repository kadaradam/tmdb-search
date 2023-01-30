/* This test uses mocked REST endpoints */

import { TmdbConfigType } from '@/types';
import { assertHasProps, gsspCtx } from '@/utils';
import '@testing-library/jest-dom';
import { render, screen, waitFor } from '@testing-library/react';
import { act } from 'react-dom/test-utils';
import 'src/mock/setup';
import Search, { getServerSideProps } from 'src/pages/search';
import { SWRConfig } from 'swr';

const VALID_SEARCH_VALUE = 'Jack Reacher';

const push = jest.fn();
jest.mock('next/router', () => ({
	useRouter() {
		return {
			route: '/',
			pathname: '',
			query: { query: VALID_SEARCH_VALUE },
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

describe('Search', () => {
	let props = null as unknown as {
		configuration: TmdbConfigType;
	};

	beforeAll(async () => {
		const res = await getServerSideProps(gsspCtx());

		assertHasProps(res);

		props = res.props;

		await act(() =>
			render(
				<SWRConfig value={{ dedupingInterval: 0 }}>
					<Search {...props} />
				</SWRConfig>
			)
		);
	});

	it('checks loading indicator exists', async () => {
		await waitFor(() => expect(screen.findByLabelText('search loading')), {
			timeout: 1000,
		});
	});

	it('checks for search results, and load more button is not visible', async () => {
		await waitFor(
			() => expect(screen.findByTestId('search-list')).toBeTruthy(),
			{
				timeout: 4000,
			}
		);

		expect(screen.queryByTestId('search load more')).toBeNull();
	});
});
