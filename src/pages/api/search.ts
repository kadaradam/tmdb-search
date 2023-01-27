// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TrendingApiResponseType } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import tmdbAxios from 'src/instances/tmdbAxios';
import { ServerError } from 'src/utils/ServerError';

// Error will be shown on frontend as a snackbar
export const unexpectedError = new ServerError('Unable to search for movies.');
export const mandatoryError = { message: "'query' query param is mandatory!" };

export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<TrendingApiResponseType | ServerError>
) {
	if (req.method === 'GET') {
		try {
			const { query, page = 1 } = req.query;

			if (!query) {
				res.status(400).json(mandatoryError);
				return;
			}

			const { data } = await tmdbAxios.get<TrendingApiResponseType>(
				`/search/movie?query=${query}&page=${page}`
			);

			res.status(200).json(data);
		} catch (err) {
			console.error(`Failed to get search result. Error: ${err}`);

			return res.status(500).send(unexpectedError);
		}
	} else {
		res.status(405).end();
	}
}
