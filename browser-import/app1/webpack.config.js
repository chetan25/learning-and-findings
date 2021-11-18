const HtmlWebpackPlugin = require('html-webpack-plugin');
const path = require("path");
const webpack = require("webpack");
const SystemJSPublicPathWebpackPlugin = require("systemjs-webpack-interop/SystemJSPublicPathWebpackPlugin");

const devConfig = {
  mode: "development",
  output: {
    filename: "bundle.js",
    publicPath: "https://localhost:3000/",
    crossOriginLoading: "anonymous",
    libraryTarget: 'system'
  },
  entry: './src/index.tsx',
    module: {
        rules: [
            {
                test: /\.(js?|tsx?)$/,
                // exclude: /node_modules\/(?!(app2\/dist)\/).*/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets:  [
                            '@babel/preset-react',
                            '@babel/preset-env',
                            '@babel/preset-typescript'
                        ],
                        plugins: [
                            '@babel/plugin-transform-runtime'
                        ]
                    }
                }
            }
        ]
    },
    resolve: {
        extensions: ['.js', '.tsx', '.ts'],
    },
  devtool: "cheap-module-source-map",
  devServer: {
    port: 3000,
    https: true,
    historyApiFallback: true,
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers":
        "X-Requested-With, content-type, Authorization",
    },
  },
  externals: {
    'react': 'react', // Case matters here 
    'react-dom' : 'reactDOM' // Case matters here 
  },
  plugins: [
    // new HtmlWebpackPlugin({
    //     template: './index.html',
    // }),
    new SystemJSPublicPathWebpackPlugin()
    // new webpack.ProvidePlugin({
    //   react: path.resolve(path.join(__dirname, 'node_modules/react')),
    // }),
  ],
};

module.exports = devConfig