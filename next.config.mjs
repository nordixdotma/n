import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

/** @type {import('next').NextConfig} */
const nextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    unoptimized: true,
  },
  // Set the tracing root to the project directory to avoid Next.js
  // inferring the wrong workspace root when multiple lockfiles exist.
  outputFileTracingRoot: __dirname,
}

export default nextConfig
