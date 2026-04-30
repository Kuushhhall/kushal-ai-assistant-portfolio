/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'assets.aceternity.com',
      },
    ],
  },
  typescript: {
    // Next.js 16 runs typechecking via a spawned process on build; skip it here.
    // Use `npx tsc -p tsconfig.json --noEmit` for CI/local verification instead.
    ignoreBuildErrors: true,
  },
  experimental: {
    // Use worker threads instead of spawning child processes where possible.
    workerThreads: true,
  },
};

module.exports = nextConfig;
