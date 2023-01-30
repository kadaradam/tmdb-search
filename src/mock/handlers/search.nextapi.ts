import { MovieListItemApiResponseType } from '@/types';
import { rest } from 'msw';

const movies: Record<string, MovieListItemApiResponseType> = {
	'Jack Reacher': {
		page: 1,
		results: [
			{
				adult: false,
				backdrop_path: '/6bEbo8OLUQ8JsJxEqyHHF2uqmpa.jpg',
				genre_ids: [80, 18, 53, 28],
				id: 75780,
				original_language: 'en',
				original_title: 'Jack Reacher',
				overview:
					'When a gunman takes five lives with six shots, all evidence points to the suspect in custody. On interrogation, the suspect offers up a single note: "Get Jack Reacher!" So begins an extraordinary chase for the truth, pitting Jack Reacher against an unexpected enemy, with a skill for violence and a secret to keep.',
				popularity: 66.787,
				poster_path: '/uQBbjrLVsUibWxNDGA4Czzo8lwz.jpg',
				release_date: '2012-12-20',
				title: 'Jack Reacher',
				video: false,
				vote_average: 6.6,
				vote_count: 6153,
			},
			{
				adult: false,
				backdrop_path: '/ww1eIoywghjoMzRLRIcbJLuKnJH.jpg',
				genre_ids: [28, 53],
				id: 343611,
				original_language: 'en',
				original_title: 'Jack Reacher: Never Go Back',
				overview:
					'When Major Susan Turner is arrested for treason, ex-investigator Jack Reacher undertakes the challenging task to prove her innocence and ends up exposing a shocking conspiracy.',
				popularity: 61.909,
				poster_path: '/bvCEEs5l3ylNIgH4foqOmQk0qdi.jpg',
				release_date: '2016-10-19',
				title: 'Jack Reacher: Never Go Back',
				video: false,
				vote_average: 5.9,
				vote_count: 4259,
			},
			{
				adult: false,
				backdrop_path: null,
				genre_ids: [99],
				id: 1045592,
				original_language: 'en',
				original_title: 'Jack Reacher: When the Man Comes Around',
				overview:
					"Cast and crew speak on adapting One Shot as the first Jack Reacher film, casting Tom Cruise, earning Lee Child's blessing, additional character qualities and the performances that shape them, Lee Child's cameo in the film, and shooting the film's climax.",
				popularity: 6.871,
				poster_path: null,
				release_date: '2013-05-07',
				title: 'Jack Reacher: When the Man Comes Around',
				video: false,
				vote_average: 0,
				vote_count: 0,
			},
		],
		total_pages: 1,
		total_results: 3,
	},
};

export const searchHandler = rest.get<{}, {}, MovieListItemApiResponseType>(
	'/api/search',
	(req, res, ctx) => {
		const query = req.url.searchParams.get('query');
		const page = req.url.searchParams.get('page');

		if (!query) {
			return res(ctx.status(404));
		}

		const response = movies[query];

		if (!response) {
			return res(ctx.status(404));
		}

		return res(ctx.json(response));
	}
);
