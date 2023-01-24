// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { TrendingApiResponseType } from '@/types/Trending.type';
import type { NextApiRequest, NextApiResponse } from 'next';
import tmdbAxios from 'src/instances/tmdbAxios';
import { ServerError } from 'src/utils/ServerError';

interface SearchApiRequest extends NextApiRequest {
	body: { query: string; page?: number };
}

export default async function handler(
	req: SearchApiRequest,
	res: NextApiResponse<TrendingApiResponseType | ServerError>
) {
	if (req.method === 'GET') {
		try {
			const { query, page = 1 } = req.query;

			const { data } = await tmdbAxios.get<TrendingApiResponseType>(
				`/search/movie?query=${query}&page=${page}`
			);

			res.status(200).json(data);
		} catch (err) {
			console.error(`Failed to get search result. Error: ${err}`);

			return res
				.status(500)
				.send(new ServerError('Unable to search for movies.'));
		}
	} else {
		res.status(405).end();
	}
}
