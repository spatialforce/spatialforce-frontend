// module-test.mjs
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const testModules = [
  'express',
  'bcryptjs',
  'pg',
  'dotenv'
];

console.log('=== Module Resolution Test ===');
testModules.forEach(mod => {
  try {
    const path = require.resolve(mod);
    console.log(`✓ ${mod.padEnd(20)} => ${path}`);
  } catch (err) {
    console.log(`✗ ${mod.padEnd(20)} => ${err.message}`);
  }
});