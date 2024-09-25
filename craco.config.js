// craco.config.js
module.exports = {
  webpack: {
    configure: (webpackConfig) => {
      const oneOfRule = webpackConfig.module.rules.find((rule) => rule.oneOf);
      oneOfRule.oneOf.unshift({
        test: /\.svg$/,
        use: ['@svgr/webpack'],
      });
      return webpackConfig;
    },
  },
};
