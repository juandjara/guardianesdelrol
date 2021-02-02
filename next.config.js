module.exports = {
  images: {
    domains: ['avatar.tobi.sh', 'www.gravatar.com']
  },
  webpack(cfg) {
    cfg.module.rules.push({
      test: /\.svg$/,
      use: [
        {
          loader: '@svgr/webpack',
          options: {
            svgoConfig: {
              plugins: {
                removeViewBox: false
              }
            }
          }
        }
      ]
    })
    return cfg
  }
}
