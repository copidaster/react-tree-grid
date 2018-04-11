/// <binding />
"use strict";

var path = require('path');
var webpack = require('webpack');
var ExtractTextPlugin = require("extract-text-webpack-plugin");

var endpoint = "NOT_INITIALIZED";

module.exports = {
    devtool: 'source-map',
    entry: [
        "./app/appStart.tsx",
    ],
    output: {
        filename: "./public/dist/[name].js"
    },
    devServer: {
        contentBase: ".",
        host: "localhost",
        port: 3000,
        historyApiFallback: {
            index: './public/app.html'
        }
    },
    resolve: {
        extensions: ['.ts', '.tsx', '.js', ".jsx"],
        modules: ["node_modules", path.resolve(__dirname, "app")]
    },
    module: {
        rules:
            [
                {
                    test: [/\.scss$/, /\.css$/],
                    use: ExtractTextPlugin.extract({
                        use: [{
                            loader: "css-loader"
                        }, {
                            loader: "sass-loader"
                        }]
                    })
                },
                {
                    test: /\.ts(x?)$/,
                    use: 'ts-loader',
                    exclude: /node_modules/
                },
                {
                    test: /\.(jpe?g|gif|png)$/,
                    loader: 'file-loader?emitFile=false&name=[path][name].[ext]'
                },
                {
                    test: /\.(eot|svg|ttf|woff|woff2|otf)$/,
                    use: 'file-loader?name=/fonts/[name].[ext]'
                },
                {
                    test: /\.svg$/,
                    use: 'svg-react'
                }
            ]
    },
    plugins: [
        new webpack.optimize.CommonsChunkPlugin({
            name: "vendor",
            minChunks: function (module) {
                return module.context && module.context.indexOf("node_modules") !== -1;
            }
        }),
        new webpack.EnvironmentPlugin({ 'API_URL': endpoint, 'NODE_ENV': 'production' }),
        new ExtractTextPlugin('./public/dist/styles.css'),
    ]
};
