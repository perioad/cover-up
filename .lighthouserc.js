module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist/coverup/browser",
    },
    upload: {
      target: "temporary-public-storage",
    },
  },
};
