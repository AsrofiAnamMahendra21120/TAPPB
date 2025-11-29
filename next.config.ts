import type { NextConfig } from "next";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const withPWA = require("next-pwa")({
  dest: "public",
  register: true,
  skipWaiting: true,
  disable: process.env.NODE_ENV === "development", // PWA mati di dev biar gak nyache terus
});

const nextConfig: NextConfig = {
  // Ganti 'domains' (lama) dengan 'remotePatterns' (baru)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'your-supabase-url.supabase.co', // Sesuaikan jika perlu, atau biarkan dulu
      },
    ],
  },
};

export default withPWA(nextConfig);