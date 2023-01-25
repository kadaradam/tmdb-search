import { TrendingApiResponseType } from '@/types';
import type { NextApiRequest, NextApiResponse } from 'next';
import tmdbAxios from 'src/instances/tmdbAxios';
import { ServerError } from 'src/utils/ServerError';

interface RecommendationsApiRequest extends NextApiRequest {
	body: { movieId: number };
}

export default async function handler(
	req: RecommendationsApiRequest,
	res: NextApiResponse<TrendingApiResponseType | ServerError>
) {
	if (req.method === 'GET') {
		const { movieId } = req.body;

		try {
			const { data } = await tmdbAxios.get<TrendingApiResponseType>(
				`/movie/${movieId}/recommendations`
			);

			res.status(200).json(data);
		} catch (err) {
			console.error(
				`Failed to fetch recommendations for movie ${movieId}. Error: ${err}`
			);

			return res
				.status(500)
				.send(
					new ServerError('Unable to get recommendations for movie.')
				);
		}
	} else {
		res.status(405).end();
	}
}
