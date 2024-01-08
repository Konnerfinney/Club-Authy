/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    experimental: {
      appDir: true,
      esmExternals: "loose", 
    },
    webpack: (config) => {
        config.externals = [...config.externals, { 'zlib-sync': 'zlib-sync' }];
        return config;
    }
}

module.exports = nextConfig
