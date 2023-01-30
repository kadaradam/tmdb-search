import { configurationHandler } from './configuration.tmdb';
import { movieDetailsHandler } from './details.tmdb';
import { searchHandler } from './search.nextapi';
import { trendingMoviesHandler } from './trending.tmdb';
import { wikipediaHandler } from './wikipedia';

export const handlers = [
	trendingMoviesHandler,
	configurationHandler,
	movieDetailsHandler,
	wikipediaHandler,
	searchHandler,
];
