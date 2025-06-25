
module.exports = {
  transpileDependencies: ['vuetify','pinia', 'birpc'],
  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.mjs$/,
          include: /node_modules/,
          type: 'javascript/auto'
        }
      ]
    }
  }

}
