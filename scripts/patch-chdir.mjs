// @opennextjs/cloudflare 1.3.0 generates `process.chdir("")` in the built
// server-function handler, which throws "no such file or directory" under
// workerd's nodejs_compat (chdir to an empty path isn't a real no-op there).
// This neutralizes that specific call after every build, since our app does
// no runtime filesystem access that depends on cwd.
import { readFileSync, writeFileSync } from 'node:fs';

const path = '.open-next/server-functions/default/handler.mjs';
const content = readFileSync(path, 'utf8');
const patched = content.replaceAll(
  'process.chdir("")',
  '(function(){try{process.chdir(".")}catch(e){}})()'
);

if (patched === content) {
  console.log('[patch-chdir] No process.chdir("") found — nothing to patch (adapter may have fixed this upstream).');
} else {
  writeFileSync(path, patched);
  console.log('[patch-chdir] Patched process.chdir("") in handler.mjs');
}
