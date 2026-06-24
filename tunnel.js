const http = require('http');
const net = require('net');
const url = require('url');

// 创建本地 HTTP 服务器
const server = http.createServer((req, res) => {
  const targetUrl = url.parse('http://localhost:8080');
  
  const options = {
    hostname: targetUrl.hostname,
    port: targetUrl.port,
    path: req.url,
    method: req.method,
    headers: req.headers
  };

  const proxyReq = http.request(options, (proxyRes) => {
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err.message);
    res.writeHead(502);
    res.end('Bad Gateway');
  });

  req.pipe(proxyReq);
});

// 处理 WebSocket 升级
server.on('upgrade', (req, socket, head) => {
  const proxyReq = http.request({
    hostname: 'localhost',
    port: 8080,
    path: req.url,
    method: req.method,
    headers: req.headers
  });

  proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
    socket.write('HTTP/1.1 101 Switching Protocols\r\n' +
      'Upgrade: websocket\r\n' +
      'Connection: Upgrade\r\n' +
      '\r\n');
    proxySocket.pipe(socket);
    socket.pipe(proxySocket);
  });

  proxyReq.on('error', () => socket.destroy());
  proxyReq.end();
});

server.listen(3000, () => {
  console.log('Local proxy server running on port 3000 -> 8080');
});
