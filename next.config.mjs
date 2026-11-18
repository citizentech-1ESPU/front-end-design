/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // páginas estáticas, publicadas no Cloudflare Pages
  images: { unoptimized: true }, // a exportação estática não otimiza imagens no servidor
  turbopack: {
    // o Tailwind CSS v4 é processado pelo loader do Turbopack (sem ele, o @import "tailwindcss" e o @theme não são lidos)
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;
