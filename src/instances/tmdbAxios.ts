import axios from 'axios';
import { TMDB_API_BASE_URL } from 'src/constants';

const TMDB_API_KEY = process.env.TMDB_API_KEY;

const tmdbAxiosInstance = axios.create({
	baseURL: TMDB_API_BASE_URL,
	headers: {
		Authorization: `Bearer ${TMDB_API_KEY}`,
		'Content-Type': 'application/json',
	},
});

export default tmdbAxiosInstance;
