import http from 'node:http';
import { routes } from './routes.js';

const server = http.createServer((req, res) => {
  const { method } = req;

  const route = routes.find((route) => {
    return route.method === method;
  });

  if (route) {
    return route.handler(req, res);
  }

  return res.end('OK');
});

server.listen(3001);
console.log('Server listening on: http://localhost:3001');
