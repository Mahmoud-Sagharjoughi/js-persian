import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import path from 'node:path';

export async function verifyStandalone(browser, consumer, fixtures, name) {
  const artifact = await readFile(path.join(consumer, 'node_modules/persian/dist/persian.browser.js'), 'utf8');
  const regression = await readFile(path.join(fixtures, '../persian.test.js'), 'utf8');
  const assertions = await readFile(path.join(fixtures, 'assert.js'), 'utf8');
  const setup = `
(function () {
  var state = self.standaloneState = { prototypes: [], sentinels: {} };
  var mode = self.location.search.slice(6) || self.location.pathname;
  ['module', 'exports', 'require', 'define'].forEach(function (key) {
    if (mode === '/host') self[key] = state.sentinels[key] = Object.freeze({ host: key });
    if (mode === '/guarded') Object.defineProperty(self, key, {
      get: function () { throw new Error('Host global accessed: ' + key); }
    });
  });
  [String, Array, Object, Number, Boolean, Function, RegExp, Date, Error].forEach(function (type) {
    state.prototypes.push({ object: type.prototype, keys: Object.getOwnPropertyNames(type.prototype),
      descriptors: Object.getOwnPropertyNames(type.prototype).map(function (key) {
        return Object.getOwnPropertyDescriptor(type.prototype, key);
      }) });
  });
  state.globals = Object.getOwnPropertyNames(self).sort();
}());`;
  const capture = `
(function () {
  self.standaloneState.first = self.persian;
  self.standaloneState.configured = self.persian.createPersian({ toEnglish: { arabic: true } });
}());`;
  const isolation = `
var state = self.standaloneState;
assert.deepEqual(Object.getOwnPropertyNames(self).sort(), state.globals.concat('persian').sort());
Object.keys(state.sentinels).forEach(function (key) { assert.strictEqual(self[key], state.sentinels[key]); });
state.prototypes.forEach(function (snapshot) {
  assert.deepEqual(Object.getOwnPropertyNames(snapshot.object), snapshot.keys);
  snapshot.keys.forEach(function (key, index) {
    assert.deepEqual(Object.getOwnPropertyDescriptor(snapshot.object, key), snapshot.descriptors[index]);
  });
});
assert.ok(self.persian !== state.first);
assert.strictEqual(state.configured.toEnglish('٣'), '3');
assert.strictEqual(self.persian.toEnglish('٣'), '٣');
`;
  const suite = assertions + '\n' + isolation + '\n' + regression + '\n' + isolation;
  const pageTest = `
(function () {
  var result = document.getElementById('result');
  function fail(error) {
    result.textContent = error.stack || error.message;
    result.dataset.status = 'failed';
  }
  try {
${suite}
    result.dataset.checks = String(checks);
    var worker = new Worker('/worker.js?mode=' + self.location.pathname);
    var timer = setTimeout(function () { worker.terminate(); fail(new Error('Worker test timed out')); }, 30000);
    worker.onerror = function (error) { clearTimeout(timer); worker.terminate(); fail(error); };
    worker.onmessage = function (event) {
      clearTimeout(timer);
      worker.terminate();
      if (event.data.error) return fail(new Error(event.data.error));
      result.dataset.workerChecks = String(event.data.checks);
      result.textContent = checks + ' page assertions and ' + event.data.checks + ' worker assertions passed.';
      result.dataset.status = 'passed';
    };
  } catch (error) { fail(error); }
}());`;
  const workerTest = `
${setup}
importScripts('/persian.browser.js', '/capture.js', '/persian.browser.js');
(function () {
  try {
${suite}
    self.postMessage({ checks: checks });
  } catch (error) { self.postMessage({ error: error.stack || error.message }); }
}());`;
  const routes = {
    '/setup.js': setup, '/capture.js': capture, '/persian.browser.js': artifact,
    '/checks.js': pageTest, '/worker.js': workerTest,
  };
  const server = createServer((request, response) => {
    const url = new URL(request.url, 'http://localhost');
    if (Object.hasOwn(routes, url.pathname)) {
      response.writeHead(200, { 'Content-Type': 'text/javascript; charset=utf-8', 'Cache-Control': 'no-store' });
      response.end(routes[url.pathname]);
    } else if (['/plain', '/host', '/guarded', '/defer'].includes(url.pathname)) {
      const defer = url.pathname === '/defer' ? ' defer' : '';
      response.writeHead(200, {
        'Content-Type': 'text/html; charset=utf-8',
        'Content-Security-Policy': "default-src 'none'; script-src 'self'; worker-src 'self'; img-src data:",
      });
      response.end('<!doctype html><meta charset="utf-8"><link rel="icon" href="data:,">' +
        '<p id="result" data-status="pending">Running standalone checks…</p>' +
        ['/setup.js', '/persian.browser.js', '/capture.js', '/persian.browser.js', '/checks.js']
          .map(file => '<script' + defer + ' src="' + file + '"></script>').join(''));
    } else { response.writeHead(404); response.end(); }
  });
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve));
  try {
    for (const mode of ['plain', 'host', 'guarded', 'defer']) {
      const page = await browser.newPage();
      const errors = [];
      const requests = [];
      page.on('pageerror', error => errors.push(error.message));
      page.on('console', message => { if (message.type() === 'error') errors.push(message.text()); });
      page.on('requestfailed', request => errors.push(request.url() + ': ' + request.failure().errorText));
      page.on('request', request => requests.push(new URL(request.url()).pathname));
      try {
        const response = await page.goto('http://127.0.0.1:' + server.address().port + '/' + mode);
        assert.equal(response.status(), 200);
        await page.locator('#result[data-status="passed"], #result[data-status="failed"]').waitFor({ timeout: 60000 });
        const result = page.locator('#result');
        assert.equal(await result.getAttribute('data-status'), 'passed', await result.textContent());
        assert.ok(Number(await result.getAttribute('data-checks')) > 50000);
        assert.ok(Number(await result.getAttribute('data-worker-checks')) > 50000);
        assert.ok(requests.includes('/persian.browser.js'));
        assert.deepEqual(errors, []);
        console.log(name + ' / standalone ' + mode + ': ' + await result.textContent());
      } finally { await page.close(); }
    }
  } finally { await new Promise((resolve, reject) => server.close(error => error ? reject(error) : resolve())); }
}
