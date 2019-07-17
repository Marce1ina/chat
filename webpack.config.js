const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const OptimizeJsPlugin = require("optimize-js-plugin");

module.exports = env => {
    const PROD = "production";
    const isProd = env === PROD;

    return {
        mode: env || "production",
        entry: "./client/index.js",
        output: {
            path: path.resolve(__dirname, "public"),
            filename: "app.bundle.js"
        },
        devServer: {
            proxy: {
                "/socket.io": {
                    target: "http://localhost:3000",
                    ws: true
                }
            }
        },
        module: {
            rules: [
                {
                    test: /\.js$/,
                    loader: "babel-loader",
                    exclude: /node_modules/,
                    options: {
                        plugins: isProd ? [] : ["react-hot-loader/babel"]
                    }
                },
                {
                    test: /\.css$/,
                    use: [
                        { loader: "style-loader" },
                        {
                            loader: "css-loader",
                            options: {
                                modules: {
                                    localIdentName: "[local]--[hash:base64:5]"
                                }
                            }
                        }
                    ]
                }
            ]
        },
        plugins: [
            new HtmlWebpackPlugin({
                template: "client/index.html",
                filename: "index.html",
                inject: "body"
            }),
            isProd &&
                new OptimizeJsPlugin({
                    sourceMap: false
                })
        ].filter(Boolean)
    };
};
