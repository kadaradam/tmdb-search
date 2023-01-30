/* This test uses real endpoints */

import { TrendingApiResponseType } from '@/types';
import { testApiHandler } from 'next-test-api-route-handler';
import handler, { mandatoryError } from 'src/pages/api/search';

const MOVIE_NAME = 'Avatar';
const PAGE = 2;

describe('/api/search.ts', () => {
	const params = {
		handler,
	};
	describe('GET', () => {
		const requestInit = {
			method: 'GET',
			headers: { 'content-type': 'application/json' },
		};
		test('200', async () => {
			await testApiHandler({
				...params,
				url: `/api/search?query=${MOVIE_NAME}`,
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
		test('200 | page 2', async () => {
			await testApiHandler({
				...params,
				url: `/api/search?query=${MOVIE_NAME}&page=${PAGE}`,
				test: async ({ fetch }) => {
					const res = await fetch(requestInit);
					const result =
						(await res.json()) as TrendingApiResponseType;

					expect(res.status).toBe(200);
					expect(result).toHaveProperty('page', PAGE);
					expect(result).toHaveProperty('total_pages');
					expect(result).toHaveProperty('total_results');
					expect(result.results.length).toBeGreaterThan(0);
					expect(result.results[0]).toHaveProperty('original_title');
				},
			});
		});
		test('400: Missing query.query param', async () => {
			await testApiHandler({
				...params,
				url: `/api/search`,
				test: async ({ fetch }) => {
					const res = await fetch(requestInit);

					expect(res.status).toBe(400);
					await expect(res.json()).resolves.toStrictEqual(
						mandatoryError
					);
				},
			});
		});
	});
});
