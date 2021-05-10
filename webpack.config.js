const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const base = process.env.NODE_ENV === "production" ? "./" : "./";

module.exports = {
  devtool: "source-map",
  mode: process.env.NODE_ENV === "production" ? "production" : "development",
  entry: path.resolve(__dirname, "./src/index.js"),
  output: {
    publicPath: base,
    filename: "main.js",
    path: path.resolve(__dirname, "./dist"),
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              outputPath: "images",
              publicPath: base + "/images",
            },
          },
        ],
      },
    ],
  },
  devServer: {
    contentBase: "./dist",
    port: 8081,
    open: true,
    hotOnly: true
},
  plugins: [new HtmlWebpackPlugin()],
};
