/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  async rewrites() {
    return [
      {
        source: '/rss',
        destination: 'https://fe-developers.kakaoent.com/rss.xml',
      },
      {
        source: '/feed',
        destination: 'http://localhost:3000/api/staticdata'
      }
    ];
  }
}

module.exports = nextConfig
