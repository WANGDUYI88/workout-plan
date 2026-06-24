const http = require('http');
const https = require('https');
const net = require('net');

// 配置 - 使用 expose.sh 免费 tunnel 服务
const LOCAL_PORT = 8080;
const TUNNEL_HOST = 'expose.sh';
const TUNNEL_PORT = 80;

console.log('Starting deployment...');
console.log(`Local server: http://localhost:${LOCAL_PORT}`);

// 第一步：获取公网 URL
function getTunnelUrl() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: TUNNEL_HOST,
      port: TUNNEL_PORT,
      path: '/api/tunnels',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          resolve(result);
        } catch (e) {
          reject(e);
        }
      });
    });
    
    req.on('error', reject);
    req.write(JSON.stringify({ port: LOCAL_PORT }));
    req.end();
  });
}

// 第二步：建立 TCP tunnel
function createTunnel(remoteHost, remotePort) {
  const localSocket = net.connect(LOCAL_PORT, 'localhost');
  const remoteSocket = net.connect(remotePort, remoteHost);
  
  localSocket.pipe(remoteSocket);
  remoteSocket.pipe(localSocket);
  
  localSocket.on('error', () => {});
  remoteSocket.on('error', () => {});
  
  console.log(`Tunnel established: ${remoteHost}:${remotePort} -> localhost:${LOCAL_PORT}`);
}

// 备用方案：使用 serveo.net (SSH tunnel)
console.log('\n=== 部署方案 ===');
console.log('由于自动部署服务受限，请使用以下任一方式：\n');

console.log('【方案一：SSH Tunnel (推荐)】');
console.log('在终端运行：');
console.log('ssh -R 80:localhost:8080 serveo.net');
console.log('然后会显示一个 https://xxx.serveo.net 的链接\n');

console.log('【方案二：LocalTunnel】');
console.log('在终端运行：');
console.log('npx localtunnel --port 8080');
console.log('然后会显示一个 https://xxx.loca.lt 的链接\n');

console.log('【方案三：直接分享本地文件】');
console.log('将整个 workout plan 文件夹压缩发送给对方');
console.log('对方解压后用浏览器打开 index.html 即可查看\n');

console.log('本地服务器已在 http://localhost:8080 运行');
console.log('你可以先在本机预览确认效果。');
