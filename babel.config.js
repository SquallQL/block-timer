module.exports = {
  presets: ["@vue/cli-plugin-babel/preset"],
  plugins: [
    [
      "babel-plugin-root-import",
      {
        paths: [
          {
            rootPathSuffix: "./src",
            rootPathPrefix: "~/",
          },
          {
            rootPathSuffix: "./src/components",
            rootPathPrefix: "!/",
          },
        ],
      },
    ],
  ],
};
