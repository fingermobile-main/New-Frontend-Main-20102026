const http = require('http');

const PORT = 3002;
const TARGET_PORT = 3000;

const server = http.createServer((req, res) => {
  const options = {
    hostname: '127.0.0.1',
    port: TARGET_PORT,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res, { end: true });
  });

  proxyReq.on('error', (err) => {
    console.error(`Proxy error forwarding to port ${TARGET_PORT}:`, err.message);
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end(`Bad Gateway: Could not forward to port ${TARGET_PORT}`);
  });

  req.pipe(proxyReq, { end: true });
});

server.listen(PORT, '0.0.0.0', () => {
  console.log(`[Dual-Port Proxy] Listening on http://localhost:${PORT} and proxying to http://localhost:${TARGET_PORT}`);
});
