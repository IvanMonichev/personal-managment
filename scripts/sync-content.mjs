import { copyFileSync, mkdirSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const sourcePath = join(rootDir, 'response-common.md');
const publicDir = join(rootDir, 'public');
const targetPath = join(publicDir, 'response-common.md');

mkdirSync(publicDir, { recursive: true });
copyFileSync(sourcePath, targetPath);
