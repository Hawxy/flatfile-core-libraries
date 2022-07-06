const nodeExternals = require("webpack-node-externals");

module.exports = {
  mode: "development",
  entry: "./src/hook.ts",
  externalsPresets: { node: true },
  output: {
    filename: "hook.js", 
    library: {
      name: 'hook',
      type: 'umd',
    },
  },
  target: "node", 
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
  })], 
};
