import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Server & Endpoints Integration Suite', () => {
  const BASE_URL = 'http://localhost:3000';

  test('GET / serves index.html with 200 OK', async () => {
    const res = await fetch(`${BASE_URL}/`);
    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type'), /text\/html/);
    const text = await res.text();
    assert.match(text, /NextLogic Portal/);
  });

  test('GET /style.css serves stylesheet with 200 OK', async () => {
    const res = await fetch(`${BASE_URL}/style.css`);
    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type'), /text\/css/);
  });

  test('GET /script.js serves client script with 200 OK', async () => {
    const res = await fetch(`${BASE_URL}/script.js`);
    assert.strictEqual(res.status, 200);
    assert.match(res.headers.get('content-type'), /text\/javascript/);
  });

  test('POST /api/login rejects invalid format with 400 Bad Request', async () => {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: 'bademail', password: '123' })
    });

    assert.strictEqual(res.status, 400);
    const data = await res.json();
    assert.strictEqual(data.success, false);
    assert.ok(data.errors.email);
    assert.ok(data.errors.password);
  });

  test('POST /api/login succeeds with valid test credentials', async () => {
    const res = await fetch(`${BASE_URL}/api/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'intern@nextlogic.com',
        password: 'NextLogic@2026'
      })
    });

    assert.strictEqual(res.status, 200);
    const data = await res.json();
    assert.strictEqual(data.success, true);
    assert.match(data.message, /Authentication successful/);
  });
});

