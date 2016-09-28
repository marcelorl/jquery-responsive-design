var webpack = require('webpack'),
  HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  debug: true,
  devtool: 'sourcemap',
  noInfo: false,
  entry: [
    'babel-polyfill', './src/index.js'
  ],
  output: {
    path: __dirname + '/dist',
    publicPath: '/',
    filename: 'bundle.js'
  },
  plugins: [
    new webpack.optimize.OccurenceOrderPlugin(),
    new webpack.NoErrorsPlugin(),
    new webpack.optimize.DedupePlugin(),
    new HtmlWebpackPlugin({
      inject: false,
      template: 'src/index.ejs',
      mobile: true,
      title: 'Anonymous',
      links: [
        'https://fonts.googleapis.com/css?family=Source+Sans+Pro'
      ]
    })
  ],
  module: {
    loaders: [
      {test: /\.js$/, exclude: /node_modules/, loaders: ['babel']},
      {test: /\.css$/, loaders: ['style', 'css']},
      {test: /\.(jpe?g|png|gif|svg)$/i, loaders:
        [
          'file?hash=sha512&digest=hex&name=[hash].[ext]',
          'image-webpack?{progressive:true, optimizationLevel: 7, interlaced: false, pngquant:{quality: "65-90", speed: 4}}'
        ]
      },
      {test: /\.html$/, loaders: ['html']}
    ]
  }
}
