/**
 * 开发环境配置
 */
var path = require('path')
var webpack = require('webpack')

module.exports = {
    // entry: ["babel-polyfill", "./src/main.js"],
    entry: ["./src/main.js"],
    output: {
        path: path.resolve(__dirname, './dist'),
        publicPath: '/dist/',
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
            },
            {
                test: /iview\/.*?js$/,
                loader: 'babel-loader'
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
        })
    ],
    devServer: {
        historyApiFallback: true,
        noInfo: true,
        proxy: {
            '/tourManager/v1.0': {
                target: 'http://47.99.178.121:8880/tourManager/v1.0',
                // target: 'http://192.168.0.110:80/tourManager/v1.0',
                pathRewrite: {
                    '^/tourManager/v1.0': '',
                },
                changeOrigin: true,
                secure: false
            },
            '/utf8-jsp': {
                target: 'http://api.zwjie.cn:8181/utf8-jsp',
                pathRewrite: {
                    '^/utf8-jsp': '',
                },
                changeOrigin: true,
                secure: false,
            },
        },
        // disableHostCheck: true //本地域名解析配置

    },
    performance: {
        hints: false
    },
    //devtool: '#eval-source-map'
}
if (process.env.NODE_ENV === 'production') {
    // module.exports.devtool = '#source-map'
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
                warnings: false
            }
        }),
        new webpack.LoaderOptionsPlugin({
            minimize: true
        })
    ])
}
