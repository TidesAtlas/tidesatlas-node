'use strict';

const TidesAtlas = require('./index');
const { TidesAtlasError } = require('./index');

let passed = 0;
let failed = 0;

function assert(condition, label) {
  if (condition) {
    passed++;
    console.log(`  PASS  ${label}`);
  } else {
    failed++;
    console.error(`  FAIL  ${label}`);
  }
}

console.log('TidesAtlas Node.js SDK — Unit Tests\n');

// ─── Constructor tests ───
console.log('Constructor:');

assert(typeof TidesAtlas === 'function', 'TidesAtlas is a constructor');
assert(typeof TidesAtlasError === 'function', 'TidesAtlasError is exported');

const client = new TidesAtlas('test-key-123');
assert(client.apiKey === 'test-key-123', 'apiKey is set');
assert(client.baseUrl === 'https://tidesatlas.com/api/v1', 'default baseUrl');
assert(client.timeout === 30000, 'default timeout');

const custom = new TidesAtlas('key', { baseUrl: 'https://custom.api/v2/', timeout: 5000 });
assert(custom.baseUrl === 'https://custom.api/v2', 'custom baseUrl (trailing slash stripped)');
assert(custom.timeout === 5000, 'custom timeout');

try {
  new TidesAtlas();
  assert(false, 'throws without apiKey');
} catch (e) {
  assert(e.message.includes('apiKey'), 'throws without apiKey');
}

try {
  new TidesAtlas('');
  assert(false, 'throws with empty apiKey');
} catch (e) {
  assert(e.message.includes('apiKey'), 'throws with empty apiKey');
}

// ─── Error class tests ───
console.log('\nTidesAtlasError:');

const err = new TidesAtlasError('Not found', 404, { error: true });
assert(err instanceof Error, 'extends Error');
assert(err instanceof TidesAtlasError, 'instanceof TidesAtlasError');
assert(err.name === 'TidesAtlasError', 'name is TidesAtlasError');
assert(err.message === 'Not found', 'message is set');
assert(err.status === 404, 'status is set');
assert(err.body.error === true, 'body is set');

// ─── Method existence tests ───
console.log('\nMethods:');

const methods = ['tides', 'ports', 'countries', 'weather', 'marine', 'astronomy', 'conditions', 'history', '_request'];
for (const m of methods) {
  assert(typeof client[m] === 'function', `client.${m}() exists`);
}

// ─── Export tests ───
console.log('\nExports:');

const mod = require('./index');
assert(mod === TidesAtlas, 'module.exports is TidesAtlas');
assert(mod.TidesAtlas === TidesAtlas, 'module.exports.TidesAtlas');
assert(mod.TidesAtlasError === TidesAtlasError, 'module.exports.TidesAtlasError');
assert(mod.default === TidesAtlas, 'module.exports.default');

// ─── Summary ───
console.log(`\n${passed + failed} tests: ${passed} passed, ${failed} failed`);
process.exit(failed > 0 ? 1 : 0);
