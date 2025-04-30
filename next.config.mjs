// next.config.mjs
const nextConfig = {
  experimental: {
    serverComponentsExternalPackages: ['openai'], // Critical for OpenAI
    outputFileTracingIncludes: {
      '/api/generateAdvice': ['./node_modules/openai/**/*']
    }
  },
  // Vercel-specific timeout increase
  functions: {
    'pages/api/generateAdvice.js': {
      maxDuration: 30 // Seconds (Vercel's max)
    }
  }
};

export default nextConfig;