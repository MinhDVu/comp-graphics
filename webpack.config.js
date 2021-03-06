const HtmlWebpackPlugin = require('html-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');

module.exports = {
    mode: 'development',
    entry: {
        main: './src/index.js',
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: 'eslint-loader',
            },
            {
                test: /\.(ply|obj|mtl|png|jpg)/i,
                use: [
                    {
                        loader: 'file-loader',
                        options: {
                            limit: false,
                        },
                    },
                ],
            },
        ],
    },
    devServer: {
        contentBase: './test',
    },
    plugins: [
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            minify: true,
            title: 'Test Environment',
        }),
    ],
    output: {
        filename: 'index.js',
    },
};
