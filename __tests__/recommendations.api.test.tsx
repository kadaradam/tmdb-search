import { TrendingApiResponseType } from '@/types';
import { testApiHandler } from 'next-test-api-route-handler';
import handler, {
	mandatoryError,
	unexpectedError,
} from 'src/pages/api/recommendations';

const MOVIE_ID = '343611';

describe('/api/recommendations.ts', () => {
	const params = {
		handler,
		url: `/api/recommendations?movieId=${MOVIE_ID}`,
	};
	describe('GET', () => {
		const requestInit = {
			method: 'GET',
			headers: { 'content-type': 'application/json' },
		};
		test('200', async () => {
			await testApiHandler({
				...params,
				test: async ({ fetch }) => {
					const res = await fetch(requestInit);
					const result =
						(await res.json()) as TrendingApiResponseType;

					expect(res.status).toBe(200);
					expect(result).toHaveProperty('page');
					expect(result).toHaveProperty('total_pages');
					expect(result).toHaveProperty('total_results');
					expect(result.results.length).toBeGreaterThan(0);
					expect(result.results[0]).toHaveProperty('original_title');
				},
			});
		});
		test('400: Missing query.movieId', async () => {
			await testApiHandler({
				...params,
				url: `/api/recommendations`,
				test: async ({ fetch }) => {
					const res = await fetch(requestInit);

					expect(res.status).toBe(400);
					await expect(res.json()).resolves.toStrictEqual(
						mandatoryError
					);
				},
			});
		});
		test('404: Invalid movieId provided', async () => {
			await testApiHandler({
				...params,
				url: `/api/recommendations?movieId=asd`,
				test: async ({ fetch }) => {
					const res = await fetch(requestInit);

					const result = await res.json();

					expect(res.status).toBe(500);
					expect(result).toStrictEqual(unexpectedError);
				},
			});
		});
	});
});
