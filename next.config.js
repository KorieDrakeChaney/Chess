/** @type {import('next').NextConfig} */
const nextConfig ={
  reactStrictMode: false,
  swcMinify: true,
  webpack: (config, options) => {
    config.module.rules.push({
      test: /\.mp3$/,
      loader: 'file-loader',
      options: {
        name: '[path][name].[ext]',
      },
    })


    return config
  },
}

module.exports = nextConfig