module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist/coverup/browser",
      numberOfRuns: 1,
    },
    upload: {
      target: "filesystem",
      outputDir: "./lhci",
    },
  },
};
