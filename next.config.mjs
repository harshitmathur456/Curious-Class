/** @type {import('next').NextConfig} */
const nextConfig = {
  outputFileTracingExcludes: {
    '*': [
      'public/notes/**/*',
    ],
    '/api/notes': [
      'public/notes/**/*',
    ],
  },
};

export default nextConfig;
