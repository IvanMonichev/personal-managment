import { copyFileSync, mkdirSync } from 'node:fs';
import { join, resolve } from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const contentFile = resolve('response-common.md');
const publicDir = resolve('public');
const publicContentFile = join(publicDir, 'response-common.md');

function syncContent() {
  mkdirSync(publicDir, { recursive: true });
  copyFileSync(contentFile, publicContentFile);
}

function contentSyncPlugin() {
  return {
    name: 'content-sync',
    buildStart() {
      syncContent();
    },
    configureServer(server) {
      syncContent();
      server.watcher.add(contentFile);
      server.watcher.on('change', (changedPath) => {
        if (resolve(changedPath) === contentFile) {
          syncContent();
          server.ws.send({ type: 'full-reload' });
        }
      });
    },
  };
}

export default defineConfig({
  base: './',
  plugins: [contentSyncPlugin(), react()],
});
