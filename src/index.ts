import http, { RequestOptions } from 'node:http';
import https from 'node:https';
import { URL } from 'node:url';
import { isHttpProtocol } from 'utils';

interface ProxyConfig {
  target: string;
  rewrite?: (path: string) => string;
  changeOrigin?: boolean;
}

function proxyPlugin(config: ProxyConfig) {
  return <T extends any>(pathname: string, method: string, body?: any, opts: RequestOptions = {}): Promise<T> => {
    opts.method = method;
    const target = new URL(config.target);

    const rewrite = config.rewrite || ((pathanme: string) => pathanme);

    opts.path = new URL(rewrite(pathname), `${target.protocol}//${target.host}${target.pathname}`).pathname;
    opts.host = target.host;
    opts.hostname = target.hostname;
    opts.port = target.port;
    opts.protocol = target.protocol;

    if (config.changeOrigin) {
      if (opts.headers && opts.headers['host']) {
        opts.headers['host'] = opts.host;
      }
    }
    
    if (!isHttpProtocol(opts.protocol)) {
      throw new Error(`Only the \`http protocol\` is supported, but the protocol you gave is \`${opts.protocol}\``);
    }

    const request = opts.protocol === 'http:' ? http.request : https.request;

    return new Promise((resolve, reject) => {
      const req = request(opts, (res) => {
        let data: any = '';
        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          resolve((data as Buffer).toString() as T);
        });
      });
      req.on('error', (err) => {
        reject(err);
      });

      if (opts.headers?.['content-type'] === 'application/json' && body) {
        req.end(JSON.stringify(body));
      } else {
        req.end(body);
      }
    });
  };
}

export default proxyPlugin;
