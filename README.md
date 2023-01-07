## http-node-proxy-plugin

> An http service proxy library

### Install

```bash
npm i http-node-proxy-plugin
```

or

```bash
yarn add http-node-proxy-plugin
```

or

```bash
pnpm i http-node-proxy-plugin
```
### Usage


```typescript
import proxyPlugin from "http-node-proxy-plugin"
import http form "http"

const proxy = proxyPlugin({
  target: `https://localhost/`,
  changeOrigin: true,
  rewrite(path: any) {
    return path.replace(/^\/proxyApi/, '')
  },
})

const server = http.createServer((req, res) => {
  if (req.url.indexOf('/proxyApi') === 0) {
    proxy(req.url, 'GET', undefined, { headers: req.headers }).then((data) => {
      res.writeHead(200);
      res.end(data);
    })
  }
  // ...
})

server.listen(8080)
```