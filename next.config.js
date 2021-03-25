const withYaml = require("next-plugin-yaml");

module.exports = withYaml({
  images: {
    domains: ["screenshotapi-dot-net.storage.googleapis.com"],
  },
});
