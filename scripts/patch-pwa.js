import fs from 'node:fs';
import path from 'node:path';

function fixFile(filePath) {
  if (!fs.existsSync(filePath)) return;
  let code = fs.readFileSync(filePath, 'utf8');
  if (code.includes('Boolean(__dirname && require("node:path").isAbsolute(__dirname))')) {
    return;
  }
  code = code.replaceAll(
    'typeof __dirname !== "undefined" ? __dirname :',
    'typeof __dirname !== "undefined" && Boolean(__dirname && require("node:path").isAbsolute(__dirname)) ? __dirname :'
  );
  code = code.replaceAll(
    'typeof __dirname !== "undefined" && require("node:path").isAbsolute(__dirname) ? __dirname :',
    'typeof __dirname !== "undefined" && Boolean(__dirname && require("node:path").isAbsolute(__dirname)) ? __dirname :'
  );
  fs.writeFileSync(filePath, code);
  console.log('[patch-pwa] Patched:', filePath);
}

fixFile(path.resolve('node_modules/vite-plugin-pwa/dist/index.js'));
fixFile(path.resolve('node_modules/vite-plugin-pwa/dist/index.cjs'));
