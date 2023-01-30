import { configurationHandler } from './configuration.tmdb';
import { movieDetailsHandler } from './details.tmdb';
import { trendingMoviesHandler } from './trending.tmdb';
import { wikipediaHandler } from './wikipedia';

export const handlers = [
	trendingMoviesHandler,
	configurationHandler,
	movieDetailsHandler,
	wikipediaHandler,
];
