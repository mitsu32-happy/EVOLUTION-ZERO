import { defineConfig } from 'vite';
import { cpSync, existsSync } from 'node:fs';
import { resolve } from 'node:path';

function copyAudioAssets() {
  return {
    name: 'copy-audio-assets',
    closeBundle() {
      const source = resolve('assets/audio');
      const target = resolve('dist/assets/audio');

      if (existsSync(source)) {
        cpSync(source, target, { recursive: true });
      }
    },
  };
}

export default defineConfig({
  base: '/EVOLUTION-ZERO/',
  plugins: [copyAudioAssets()],
});
