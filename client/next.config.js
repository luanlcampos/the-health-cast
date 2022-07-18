// next.config.js
const withTM = require("next-transpile-modules")(["@jitsi/react-sdk"]); // pass the modules you would like to see transpiled

module.exports = withTM({
  // your custom next config
  reactStrictMode: false,
});

// OLD Code

// /** @type {import('next').NextConfig} */
// const nextConfig = {
//   reactStrictMode: false,

// }

// module.exports = nextConfig
