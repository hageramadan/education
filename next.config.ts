import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
      remotePatterns: [
      {
        protocol: 'https',
        hostname: 'education.admin.t-carts.com',
        port: '',
        pathname: '/storage/**',
      },
         {
        protocol: 'https',
        hostname: 'education.admin.t-carts.com',
        port: '',
        pathname: '/**', 
      },
       {
        protocol: 'http', // في حالة استخدام http للتطوير المحلي
        hostname: 'localhost',
        port: '',
        pathname: '/**',
      },
    ],
    qualities: [100, 75],
  
  },
};

export default nextConfig;
