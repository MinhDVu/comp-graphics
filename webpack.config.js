const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

// TODO: Handle multiple content output url
module.exports = {
    mode: 'development',
    entry: {
        main: './src/scripts/index.js',
        test: './src/scripts/test.js'
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            }
        ],
    },
    devServer: {
        contentBase: './test',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            minify: true,
            title: "Minh's Index Environment",
            template: './src/index.html',
            filename: './dist/index.html',
        }),
        new HtmlWebpackPlugin({
            minify: true,
            title: "Test Environment",
            template: './src/index.html',
            filename: './dist/settings.html'
        })
    ],
    output: {
        filename: '[name].js'
    },
};
