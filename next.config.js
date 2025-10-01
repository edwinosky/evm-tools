/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  output: 'export',
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://evm-tools.drainerless.xyz/api/:path*',
      },
    ]
  },
  // Note: i18n config is handled by next-i18next in I18NProvider component
};

module.exports = nextConfig;
