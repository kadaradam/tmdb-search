import SearchInput from '@/components/SearchInput';
import '@testing-library/jest-dom';
import { fireEvent, render, screen } from '@testing-library/react';

const SEARCH_VALUE = 'Jack';

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

it('renders search input', async () => {
	render(<SearchInput />);

	const input = screen.getByPlaceholderText('Search');

	expect(input).toBeInTheDocument();
});

it('fills search input', async () => {
	render(<SearchInput />);

	const input = screen.getByPlaceholderText<HTMLInputElement>('Search');

	fireEvent.change(input, { target: { value: SEARCH_VALUE } });

	expect(input.value).toBe(SEARCH_VALUE);
});

it('submits search input with ENTER', async () => {
	push.mockReset();

	render(<SearchInput />);

	const input = screen.getByPlaceholderText<HTMLInputElement>('Search');

	fireEvent.change(input, { target: { value: SEARCH_VALUE } });
	fireEvent.keyDown(input, { key: 'Enter', code: 13, charCode: 13 });

	expect(push).toHaveBeenCalled();
	expect(push).toHaveBeenCalledWith(`/search?query=${SEARCH_VALUE}`);
});

it('submits search input with BUTTON', async () => {
	push.mockReset();

	render(<SearchInput />);

	const input = screen.getByPlaceholderText<HTMLInputElement>('Search');

	fireEvent.change(input, { target: { value: SEARCH_VALUE } });

	const btn = screen.getByLabelText<HTMLButtonElement>('search for a movie');

	btn.click();

	expect(push).toHaveBeenCalled();
	expect(push).toHaveBeenCalledWith(`/search?query=${SEARCH_VALUE}`);
});
