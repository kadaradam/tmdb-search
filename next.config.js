/** @type {import('next').NextConfig} */
const nextConfig = {
	reactStrictMode: true,
	images: {
		domains: ['image.tmdb.org'],
		remotePatterns: [
			{
				protocol: 'http',
				hostname: 'image.tmdb.org',
				port: '',
				pathname: '/t/p/**',
			},
		],
	},
};

module.exports = nextConfig;
