/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  output: 'standalone',
  async rewrites() {
    return [
      {
        source: '/rss',
        destination: 'https://fe-developers.kakaoent.com/rss.xml',
      },
    ];
  }
}

module.exports = nextConfig
