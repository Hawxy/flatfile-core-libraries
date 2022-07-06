const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "development",
  entry: "./src/hook.ts",
  externalsPresets: { node: true },
  output: {
    filename: "hook.js", // <-- Important
    library: "my-library",
    libraryTarget: "umd"
  },
  target: "node", // <-- Important
  module: {
    rules: [
      {
        test: /\.ts?$/,
        loader: "ts-loader",
        options: {
          transpileOnly: true,
        },
      },
    ],
  },
  resolve: {
    extensions: [".ts", ".tsx", ".js"],
  },
  externals: [nodeExternals({
    allowlist: ['case-anything']
  })], // <-- Important
};
