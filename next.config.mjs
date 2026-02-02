// next.config.mjs
const nextConfig = {
  serverExternalPackages: ['openai'], // Critical for OpenAI
  outputFileTracingIncludes: {
    '/api/generateAdvice': ['./node_modules/openai/**/*']
  }
};

export default nextConfig;