const ExtractTextPlugin = require('extract-text-webpack-plugin');
const path = require('path');
const webpack = require('webpack');
const glob = require('glob');

module.exports = {
    entry: {
        vendor: ['jquery'],
        nem: ['webpack-dev-server/client?http://0.0.0.0:8000', 'webpack/hot/only-dev-server', './src/index.js', './src/styles/index.less', ...glob.sync('./src/resource/*')],
    },
    output: {
        path: path.resolve('./dist/assets'),
        publicPath: '/assets/',
        filename: '[name]/bundle.js',
    },
    module: {
        loaders: [
            {
                test: /\.(js|jsx)$/,
                exclude: /node_modules/,
                loaders: ['react-hot', 'babel'],
            },
            {
                test: /\.less$/,
                loader: ExtractTextPlugin.extract('style-loader', 'css-loader!less-loader'),
            },
            {
                test: /\.(jpg|png|jpeg|gif)$/,
                loader: 'url-loader!file-loader?limit=8192&name=/icons/[name].[ext]',
            },
            {
                test: /\.json$/,
                loader: 'json-loader',
            },
        ],
    },
    node: {
        // console: 'empty',
        fs: 'empty',
        net: 'empty',
        tls: 'empty',
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.ProvidePlugin({
            $: 'jquery',
            jQuery: 'jquery',
            React: 'react',
        }),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'vendor',
            filename: 'vendor.js',
            minChunks: Infinity,
        }),

        new ExtractTextPlugin('./[name]/bundle.css'),
    ],
    devServer:
    {
        /* transit proxy 可以解决跨域请求的问题 将浏览器的请求经服务器发给target/
            referer 实现认为网易自己的域
        */
        proxy: {
            '/weapi/**': {
                target: {
                    host: 'music.163.com',
                    protocol: 'http:',
                    port: 80,
                },
                ignorePath: false,
                changeOrigin: true,
                secure: false,
                headers: {
                    Accept: '*/*',
                    Host: 'music.163.com',
                    Referer: 'http://music.163.com',
                    Cookie: 'appver=2.0.2',
                },
            },
            '/api/**': {
                target: {
                    host: 'music.163.com',
                    protocol: 'http:',
                    port: 80,
                },
                ignorePath: false,
                changeOrigin: true,
                secure: false,
                headers: {
                    Accept: '*/*',
                    Host: 'music.163.com',
                    Referer: 'http://music.163.com',
                    Cookie: 'appver=2.0.2',
                },
            },
        },
    },
};
