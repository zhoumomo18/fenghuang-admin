/**
 * 生产环境配置
 */
var path = require('path')
var webpack = require('webpack')
var HtmlWebpackPlugin = require('html-webpack-plugin'); // 【生产环境】
const CleanWebpackPlugin = require('clean-webpack-plugin'); // 【生产环境】
var CopyWebpackPlugin = require('copy-webpack-plugin'); // 【生产环境】

module.exports = {
  entry: './src/main.js',
  output: {
    path: path.resolve(__dirname, './dist'),
    publicPath: './', // 打包后的路径 必须 ./
    filename: 'build.js'
  },
  module: {
    rules: [{
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
          loaders: {}
          // other vue-loader options go here
        }
      },
      {
        test: /\.js$/,
        loader: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(png|jpg|jpeg|gif|svg)$/,
        loader: 'file-loader',
        options: {
          name: 'images/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.(woff|woff2|ttf|eot)(\?\S*)?$/,
        loader: 'file-loader',
        options: {
          name: 'fonts/[name].[ext]?[hash]'
        }
      },
      {
        test: /\.css/,
        loader: 'style-loader!css-loader'
      },
      {
        test: /\.less/,
        loader: 'style-loader!css-loader!less-loader'
      }
    ]
  },
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new webpack.ProvidePlugin({
      $: "jquery",
      jQuery: "jquery"
    }),
    new CleanWebpackPlugin( // 【生产环境】
      ['./dist/index.html'], 　 //匹配删除的文件
      {
        root: __dirname,
        　　　　　　　　　　 //根目录
        verbose: true,
        　　　　　　　　　　 //开启在控制台输出信息
        dry: false　　　　　　　　　　 //启用删除文件
      }
    ),
    new HtmlWebpackPlugin({ //根据模板插入js等生成最终HTML // 【生产环境】
      filename: './index.html', //生成的html存放路径，相对于 path
      template: './src/index.html', //html模板路径
      inject: true, //允许插件修改哪些内容，包括head与body
      hash: true, //为静态资源生成hash值
      minify: { //压缩HTML文件
        removeComments: true, //移除HTML中的注释
        collapseWhitespace: false //删除空白符与换行符
      }
    }),
    new CopyWebpackPlugin([ // 【生产环境】
      {
        from: __dirname + '/src/assets',
        to: path.resolve(__dirname, './dist'),
      },
    //   {
    //     from: __dirname + '/src/assets/images',
    //     to: path.resolve(__dirname, './dist/images'),
    //   }
    ])
  ],
  devServer: {
    historyApiFallback: true,
    noInfo: true,
    proxy: {
       '/v1.0': {
        target: 'http://admintour.cworld-china.com/tourManager/v1.0/',
        pathRewrite: {
          '^/v1.0': ''
        },
        changeOrigin: true,
        secure: false,
      }
    }

  },
  performance: {
    hints: false
  },
  devtool: '#cheap-module-eval-source-map'
}

if (process.env.NODE_ENV === 'production') {
//   module.exports.devtool = '#cheap-module-eval-source-map'
  module.exports.devtool = '#cheap-module-source-map'
  // http://vue-loader.vuejs.org/en/workflow/production.html
  module.exports.plugins = (module.exports.plugins || []).concat([
    new webpack.DefinePlugin({
      'process.env': {
        NODE_ENV: '"production"'
      }
    }),
    new webpack.optimize.UglifyJsPlugin({
      sourceMap: false,
      compress: {
        warnings: false,
        /*不显示控制台打印信息*/
        drop_debugger: true,
        drop_console: true,
        pure_funcs: ['console.log']
      }
    }),
    new webpack.LoaderOptionsPlugin({
      minimize: true
    })
  ])
}
