/** @type {import('next').NextConfig} */
const nextConfig = {
    output: 'standalone',
    eslint: {
        ignoreDuringBuilds: true,
    },
    typescript: {
        ignoreBuildErrors: false,
    },
    // Add these for proper standalone build
    experimental: {
        outputFileTracingRoot: undefined,
    },
}

module.exports = nextConfig