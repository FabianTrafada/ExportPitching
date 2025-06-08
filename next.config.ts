import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['img.clerk.com', 'flagcdn.com', 'res.cloudinary.com'],
  },
  webpack(config) {
    config.module.rules.push({
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac|rtf|doc|docx)$/,
      use: {
        loader: 'file-loader',
        options: {
          name: 'static/media/[name].[hash].[ext]',
          publicPath: '/_next/',
        },
      },
    });
    return config;
  }
};

export default nextConfig;
