import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import path from 'path';
import pkg from './package.json';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: path.resolve(__dirname, './dist/bundles'),
    sourcemap: true,
    target: 'esnext',
    minify: false,
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      name: pkg.name,
      fileName: (format) =>
        `${pkg.name}.${format}.${format === 'es' ? 'js' : 'cjs'}`,
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['react', 'xstate', '@xstate/react', 'uuid'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          react: 'React',
        },
      },
    },
  },
});
