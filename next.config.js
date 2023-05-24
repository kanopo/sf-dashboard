const withPlugins = require("next-compose-plugins")
const { paths } = require("./src/i18n/config.js")

/** @type {import('next').NextConfig} */
const nextConfig = {
  swcMinify: true,
  reactStrictMode: true,
  experimental: {
    appDir: true
  },
  rewrites: async() => {
    const rewrites = []
    for (const [fsPath, i18n] of Object.entries(paths)) {
      for (const [lng, translation] of Object.entries(i18n)) {
        const source = `/${lng}${translation}`, destination = `/${lng}${fsPath}`
        if (source !== destination) {
          rewrites.push({ source, destination }, { source: destination, destination: `/${lng}/404` })
        }
      }
    }

    return rewrites
  },
  compress: false,
  poweredByHeader: false
}

const plugins = []

if (process.env.ANALYZE === "true") {
  const withBundleAnalyzer = require("@next/bundle-analyzer")({
    enabled: true
  })

  plugins.unshift([withBundleAnalyzer])
}

module.exports = withPlugins(plugins, nextConfig)
