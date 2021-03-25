const withYaml = require("next-plugin-yaml");

module.exports = withYaml({
  images: {
    loader: "imgix",
    domains: ["screenshotapi-dot-net.storage.googleapis.com"],
  },
  typescript: {
    ignoreBuildErrors: true,
  },
});
