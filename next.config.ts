/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '',
  reactStrictMode: false,
  env: {
    NEXT_PUBLIC_APP_NAME: process.env.APP_NAME,
    NEXT_PUBLIC_APP_DESCRIPTION: process.env.APP_DESCRIPTION,
    NEXT_PUBLIC_APP_OWNER: process.env.APP_OWNER,
    NEXT_PUBLIC_APP_OWNER_URL: process.env.APP_OWNER_URL,
    NEXT_PUBLIC_APP_BASE_PATH: process.env.APP_BASE_PATH,
  },
  compiler: {
    removeConsole: process.env.NODE_ENV === "production"
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*",
        port: "",
        pathname: "/**"
      }
    ]
  },
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
