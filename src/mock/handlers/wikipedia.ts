import { WikipediaApiResponseType } from '@/types';
import { rest } from 'msw';
import { WIKIPEDIA_API_BASE_URL } from 'src/constants';

const movies: Record<string, WikipediaApiResponseType> = {
	'Jack Reacher: Never Go Back': {
		batchcomplete: '',
		query: {
			pages: {
				'46787898': {
					pageid: 46787898,
					ns: 0,
					title: 'Jack Reacher: Never Go Back',
					extract:
						"Jack Reacher: Never Go Back is a 2016 American action-thriller film directed by Edward Zwick, written by Zwick, Richard Wenk, and Marshall Herskovitz, and based on the 2013 novel Never Go Back by Lee Child. A sequel to the 2012 film Jack Reacher, the film stars Tom Cruise and Cobie Smulders, with the supporting cast featuring Patrick Heusinger, Aldis Hodge, Danika Yarosh, Holt McCallany, and Robert Knepper. The plot follows Reacher going on the run with an Army major who has been framed for espionage, as the two reveal a dark conspiracy.\nPrincipal photography began on October 20, 2015, in New Orleans, and the film was released on October 21, 2016, in IMAX and conventional formats. It grossed $162 million worldwide and received mixed reviews from critics, who praised Cruise's performance and the film's action sequences, but criticized the plot.",
				},
			},
		},
	},
};

export const wikipediaHandler = rest.get<{}, {}, WikipediaApiResponseType>(
	WIKIPEDIA_API_BASE_URL,
	(req, res, ctx) => {
		const title = req.url.searchParams.get('titles');

		if (!title) {
			return res(ctx.status(404));
		}

		const response = movies[title];

		if (!response) {
			return res(ctx.status(404));
		}

		return res(ctx.json(response));
	}
);
