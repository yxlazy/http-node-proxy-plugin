import http from 'node:http';
import { URL } from 'node:url';
import proxyPlugin from 'http-node-proxy-plugin';

const proxy = proxyPlugin({
  target: `http://localhost/`,
  changeOrigin: true,
  rewrite(path) {
    return path.replace(/^\/proxyApi/, '');
  },
});

const server = http.createServer((req, res) => {
  let data = '';

  req.on('data', (chunk) => {
    data += chunk;
  });

  req.on('end', () => {
    if (req.url) {
      const url = new URL(req.url, 'http://localhost/');
      if (url.pathname.indexOf('/proxyApi') === 0) {
        let pathname = req.url,
          body;
        if (req.method === 'POST') {
          body = JSON.stringify(data);
        } else if (req.method === 'GET') {
          body = url.search.slice(1) || undefined;
        }

        proxy(pathname, req.method || 'GET', body, { headers: req.headers }).then((data) => {
          res.writeHead(200);
          res.end(data);
        });
      } else {
        res.end('success');
      }
    }
  });

  req.on('error', (err) => {
    console.log(err.message);
  });
});

server.listen(8080, () => console.log('server start at http://localhost:8080'));
