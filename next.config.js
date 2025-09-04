/** @type {import('next').NextConfig} */
const nextConfig = {
  compiler: {
    styledComponents: true,
  },
  webpack: (config) => {
    config.externals.push("pino-pretty", "lokijs", "encoding");
    return config;
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: 'http://127.0.0.1:8787/api/:path*',
      },
    ]
  },
  // Note: i18n config is handled by next-i18next in I18NProvider component
};

module.exports = nextConfig;
