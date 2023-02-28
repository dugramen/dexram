/** @type {import('next').NextConfig} */
const nextConfig = {
  // reactStrictMode: true,
}

module.exports = {
  ...nextConfig,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'raw.githubusercontent.com',
        port: '',
        // pathname: '/PokeAPI/**',
      },
    ]
  }

}
