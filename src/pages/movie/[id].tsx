import { MovieType, TmdbConfigType } from '@/types';
import { GetServerSideProps, InferGetServerSidePropsType } from 'next';
import { useRouter } from 'next/router';
import { ParsedUrlQuery } from 'querystring';
import tmdbAxios from 'src/instances/tmdbAxios';

interface ParamsType extends ParsedUrlQuery {
	id: string;
}

export const getServerSideProps: GetServerSideProps<{
	configuration: TmdbConfigType;
	movie: MovieType;
}> = async ({ params }) => {
	const { id } = params as ParamsType;

	const [{ data: configuration }, { data: movie }] = await Promise.all([
		tmdbAxios.get<TmdbConfigType>('/configuration'),
		tmdbAxios.get<MovieType>(`/movie/${id}`),
	]);

	if (!movie) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			configuration,
			movie,
		},
	};
};

export default function MovieDetails({
	configuration,
	movie,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
	const router = useRouter();

	return <></>;
}
