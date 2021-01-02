module.exports = {
  images: {
    domains: ['lh3.googleusercontent.com']
  },
  webpack (cfg) {
    cfg.module.rules.push({
      test: /\.svg$/,
      use: [{
        loader: '@svgr/webpack',
        options: {
          svgoConfig: {
            plugins: {
              removeViewBox: false
            }
          }
        }
      }]
    })
    return cfg
  }
}