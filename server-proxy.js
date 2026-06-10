const http = require('http');
const https = require('https');

const vercelHost = 'tpf-virtualizacion.vercel.app';
const localApiPort = 3001;

const server = http.createServer((clientReq, clientRes) => {
  // 1. Si la petición es a la API de la base de datos, la mandamos al Next.js local
  if (clientReq.url.includes('/api/')) {
    const options = {
      hostname: 'localhost',
      port: localApiPort,
      path: clientReq.url,
      method: clientReq.method,
      headers: clientReq.headers
    };

    const proxyReq = http.request(options, (proxyRes) => {
      clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(clientRes);
    });

    proxyReq.on('error', (e) => {
      clientRes.writeHead(500);
      clientRes.end('Local API Proxy error: ' + e.message);
    });

    clientReq.pipe(proxyReq);
    return;
  }

  // 2. Si no es de la API (HTML, assets), la mandamos a Vercel para puentear los hashes y bloqueos
  const options = {
    hostname: vercelHost,
    port: 443,
    path: clientReq.url,
    method: clientReq.method,
    headers: {
      ...clientReq.headers,
      host: vercelHost,
    }
  };

  const proxyReq = https.request(options, (proxyRes) => {
    clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
    proxyRes.pipe(clientRes);
  });

  proxyReq.on('error', (e) => {
    clientRes.writeHead(500);
    clientRes.end('Vercel Proxy error: ' + e.message);
  });

  clientReq.pipe(proxyReq);
});

server.listen(3000, '0.0.0.0', () => {
  console.log('Hybrid Proxy Server listening on port 3000');
  console.log('- API traffic (/api/) -> localhost:3001');
  console.log('- HTML traffic -> Vercel');
});
