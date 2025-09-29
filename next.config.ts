/** @type {import('next').NextConfig} */
const nextConfig = {
  async rewrites() {
    const base = process.env.BACKEND_API_URL;
    if (!base) {
      console.error("BACKEND_API_URL is missing in env");
      throw new Error("BACKEND_API_URL is missing");
    }
    return [
      {
        source: "/backapi/:path*",
        destination: `${base}/:path*`,
      },
    ];
  },
};

module.exports = nextConfig;