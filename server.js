/**
 * Localhost Server for Interactive Login Page
 * Built using Node.js standard modules (zero external dependencies required)
 */

import http from 'node:http';
import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { validateLoginForm } from './public/validation.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = process.env.PORT || 3000;
const PUBLIC_DIR = path.join(__dirname, 'public');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer(async (req, res) => {
  // CORS & Security Headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');

  const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
  const pathname = parsedUrl.pathname;

  // 1. API Route: POST /api/login
  if (req.method === 'POST' && pathname === '/api/login') {
    let body = '';
    req.on('data', chunk => {
      body += chunk;
      // Safeguard max payload size
      if (body.length > 1e6) {
        req.socket.destroy();
      }
    });

    req.on('end', () => {
      try {
        const payload = JSON.parse(body || '{}');
        const validation = validateLoginForm(payload);

        // Simulated authentication latency for realistic UX
        setTimeout(() => {
          if (!validation.isValid) {
            res.writeHead(400, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
              success: false,
              message: 'Validation failed on server.',
              errors: validation.errors
            }));
          }

          // Demo check (allow demo credentials or any valid format meeting policy)
          const { email, password } = payload;
          if (email === 'intern@nextlogic.com' && password === 'NextLogic@2026') {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            return res.end(JSON.stringify({
              success: true,
              message: 'Authentication successful! Welcome, NextLogic Intern.'
            }));
          }

          // If valid format but custom credentials
          res.writeHead(200, { 'Content-Type': 'application/json' });
          return res.end(JSON.stringify({
            success: true,
            message: `Login successful for ${email}!`
          }));
        }, 600);
      } catch (err) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: false,
          message: 'Malformed JSON payload.'
        }));
      }
    });
    return;
  }

  // 2. Static File Serving
  if (req.method === 'GET' || req.method === 'HEAD') {
    let relativePath = pathname === '/' ? 'index.html' : pathname.replace(/^\/+/, '');
    const safePath = path.normalize(path.join(PUBLIC_DIR, relativePath));

    // Ensure path remains inside public directory
    if (!safePath.startsWith(PUBLIC_DIR)) {
      res.writeHead(403, { 'Content-Type': 'text/plain' });
      return res.end('403 Forbidden');
    }

    try {
      const stats = await fs.stat(safePath);
      let targetFile = safePath;
      if (stats.isDirectory()) {
        targetFile = path.join(safePath, 'index.html');
      }

      const content = await fs.readFile(targetFile);
      const ext = path.extname(targetFile).toLowerCase();
      const contentType = MIME_TYPES[ext] || 'application/octet-stream';

      res.writeHead(200, { 'Content-Type': contentType });
      return res.end(content);
    } catch (err) {
      if (err.code === 'ENOENT') {
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        return res.end('404 Not Found');
      }
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      return res.end('500 Internal Server Error');
    }
  }

  // 3. Fallback Method Not Allowed
  res.writeHead(405, { 'Content-Type': 'text/plain' });
  res.end('405 Method Not Allowed');
});

const isDirectRun = process.argv[1] && (path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url)));

if (isDirectRun || process.env.NODE_ENV !== 'test') {
  server.listen(PORT, () => {
    console.log(`===============================================`);
    console.log(`🚀 NextLogic Login Server running on localhost!`);
    console.log(`👉 Open URL: http://localhost:${PORT}`);
    console.log(`===============================================`);
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Note: Port ${PORT} is already in use by an active server.`);
    } else {
      throw err;
    }
  });
}

export default server;

