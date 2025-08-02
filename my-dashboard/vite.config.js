// vite.config.js
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd());

  return {
    plugins: [react()],
    resolve: {
      alias: {
        // Root aliases
        '@': path.resolve(__dirname, './src'),
        '@root': path.resolve(__dirname, './'),
        
        // Component aliases
        '@components': path.resolve(__dirname, './src/components'),
        '@ui': path.resolve(__dirname, './src/components/ui'),
        '@layout': path.resolve(__dirname, './src/components/layout'),
        '@forms': path.resolve(__dirname, './src/components/forms'),
        '@features': path.resolve(__dirname, './src/components/features'),
        '@pipeline': path.resolve(__dirname, './src/components/features/pipeline'),
        
        // Utility aliases
        '@utils': path.resolve(__dirname, './src/utils'),
        '@api': path.resolve(__dirname, './src/api'),
        '@config': path.resolve(__dirname, './src/config'),
        '@hooks': path.resolve(__dirname, './src/hooks'),
        '@context': path.resolve(__dirname, './src/context'),
        '@pages': path.resolve(__dirname, './src/pages'),
        '@routes': path.resolve(__dirname, './src/routes'),
        '@styles': path.resolve(__dirname, './src/styles'),
        '@assets': path.resolve(__dirname, './src/assets'),
      },
    },
    css: {
      modules: {
        localsConvention: 'camelCase',
        generateScopedName: '[name]__[local]___[hash:base64:5]',
      },
    },
    define: {
      'process.env': env,
    },
  };
});
