export type WikipediaApiResponseType = {
	batchcomplete: string;
	query: {
		pages: {
			[pageId: string | number]: {
				extract: string;
				ns: number;
				pageid: number;
				title: string;
			};
		};
	};
};

export type WikipediaType = {
	pageId: number;
	summary: string;
};
