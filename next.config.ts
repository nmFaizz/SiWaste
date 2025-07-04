import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'lpxpxgorivdvryatmpsc.supabase.co',
        port: '', 
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
