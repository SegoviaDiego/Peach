module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: "Peach!",
        appId: "org.oxymoron.peach",
        nsis: {
          artifactName: "peach-setup.${ext}"
        },
        win: {
          publisherName: "Oxymoron",
          icon: "./src/assets/icon.ico",
          target: [
            {
              target: "nsis",
              arch: ["ia32"]
            }
          ]
        }
      }
    }
  }
};
