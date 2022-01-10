module.exports = {
  publicPath: "",
  css: {
    loaderOptions: {
      sass: {
        data: `
          @import "@/scss/assets/_variables.scss";
        `
      }
    }
  }
};