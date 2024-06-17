import { defineConfig } from 'tsup';
import copy from 'esbuild-plugin-copy';

export default defineConfig({
  entry: ['./src'],
  splitting: false,
  sourcemap: true,
  clean: true,
  loader: {
    '.graphql': 'text',
  },
  esbuildPlugins: [
    copy({
      // This plugin will copy all .graphql files to the dist folder
      assets: {
        from: ['./src/**/*.graphql'],
        to: ['./'],
      },
    }),
  ],
});
