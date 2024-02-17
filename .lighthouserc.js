module.exports = {
  ci: {
    collect: {
      staticDistDir: "./dist/coverup/browser",
      numberOfRuns: 3,
    },
    upload: {
      target: "filesystem",
      outputDir: "./lhci",
    },
  },
};
