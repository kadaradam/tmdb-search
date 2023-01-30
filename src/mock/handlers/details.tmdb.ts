import { MovieType } from '@/types';
import { rest } from 'msw';
import { TMDB_API_BASE_URL } from 'src/constants';

const movies: Record<string, MovieType> = {
	'343611': {
		adult: false,
		backdrop_path: '/ww1eIoywghjoMzRLRIcbJLuKnJH.jpg',
		belongs_to_collection: {
			id: 403374,
			name: 'Jack Reacher Collection',
			poster_path: '/qtafXiYDUMKxzsssU41qWey5oiT.jpg',
			backdrop_path: '/vViRXFnSyGJ2fzMbcc5sqTKswcd.jpg',
		},
		budget: 60000000,
		genres: [
			{
				id: 28,
				name: 'Action',
			},
			{
				id: 53,
				name: 'Thriller',
			},
		],
		homepage: '',
		id: 343611,
		imdb_id: 'tt3393786',
		original_language: 'en',
		original_title: 'Jack Reacher: Never Go Back',
		overview:
			'When Major Susan Turner is arrested for treason, ex-investigator Jack Reacher undertakes the challenging task to prove her innocence and ends up exposing a shocking conspiracy.',
		popularity: 61.909,
		poster_path: '/bvCEEs5l3ylNIgH4foqOmQk0qdi.jpg',
		production_companies: [
			{
				id: 4,
				logo_path: '/gz66EfNoYPqHTYI4q9UEN4CbHRc.png',
				name: 'Paramount',
				origin_country: 'US',
			},
			{
				id: 3407,
				logo_path: '/iVMjKOFyRvm9PW45lW1wW6TSvnj.png',
				name: 'Shanghai Film Group',
				origin_country: 'CN',
			},
			{
				id: 21777,
				logo_path: null,
				name: 'TC Productions',
				origin_country: 'US',
			},
			{
				id: 82819,
				logo_path: '/zlFa3VNua4hJyGEI4X2sqDrtEH9.png',
				name: 'Skydance Media',
				origin_country: 'US',
			},
			{
				id: 83645,
				logo_path: null,
				name: 'Huahua Media',
				origin_country: 'CN',
			},
		],
		production_countries: [
			{
				iso_3166_1: 'CN',
				name: 'China',
			},
			{
				iso_3166_1: 'US',
				name: 'United States of America',
			},
		],
		release_date: '2016-10-19',
		revenue: 162146076,
		runtime: 118,
		spoken_languages: [
			{
				english_name: 'English',
				iso_639_1: 'en',
				name: 'English',
			},
		],
		status: 'Released',
		tagline: 'Justice is Coming.',
		title: 'Jack Reacher: Never Go Back',
		video: false,
		vote_average: 5.917,
		vote_count: 4259,
	},
};

export const movieDetailsHandler = rest.get<{}, { movieId: string }, MovieType>(
	`${TMDB_API_BASE_URL}/movie/:movieId`,
	(req, res, ctx) => {
		const { movieId } = req.params;

		const movie = movies[movieId];

		if (!movie) {
			return res(ctx.status(404));
		}

		return res(ctx.json(movie));
	}
);
