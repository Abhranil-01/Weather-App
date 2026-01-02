const FaviconsWebpackPlugin = require("favicons-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const webpack = require("webpack"); // 🔴 ADD
const dotenv = require("dotenv");    // 🔴 ADD

dotenv.config(); // 🔴 LOAD .env

module.exports = {
  entry: "./src/index.js",

  module: {
    rules: [
      {
        test: /\.(png|jpe?g|gif)$/i,
        use: [
          {
            loader: "file-loader",
            options: {
              limit: 8192,
            },
          },
        ],
      },
      {
        test: /\.scss$/,
        use: [
          "style-loader",
          "css-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.js$/,
        use: "babel-loader",
        exclude: /node_modules/,
      },
    ],
  },

  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "bundle.js",
    clean: true,
  },

  devServer: {
    static: path.join(__dirname, "dist"),
    compress: true,
    port: 5173,
    open: true,
  },

  plugins: [
    new HtmlWebpackPlugin({
      template: "./src/index.html",
    }),

    new FaviconsWebpackPlugin("./src/images/favicon-32x32.png"),

    // 🔴 INJECT ENV VARIABLES INTO FRONTEND
    new webpack.DefinePlugin({
      "process.env.WEATHER_API_KEY": JSON.stringify(process.env.WEATHER_API_KEY),
    }),
  ],

  target: "web", // 🔴 IMPORTANT FOR VERCEL

  mode: process.env.NODE_ENV === "production"
    ? "production"
    : "development",
};
