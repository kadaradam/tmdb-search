export type TrendingType = {
	adult: boolean;
	backdrop_path: string;
	genre_ids: number[];
	id: number;
	original_language: string;
	original_title: string;
	overview: string;
	poster_path: string;
	release_date: Date;
	title: string;
	original_name: string;
	video: boolean;
	vote_average: number;
	vote_count: number;
	popularity: number;
};

export type TrendingApiResponseType = {
	page: number;
	total_pages: number;
	total_results: number;
	results: TrendingType[];
};
