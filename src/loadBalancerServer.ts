import http from 'node:http';
import { sendResponseJson } from './utils';
import { BASE_PORT, NUM_CPUS, SERVER_ERROR } from './constatns';

// Round-robin load balancer
const loadBalancerServer = (workerIndex: number) => {
  const loadBalancer = http.createServer((req, res) => {
    const workerPort = BASE_PORT + (workerIndex % (NUM_CPUS - 1)) + 1; // Forward to worker ports
    workerIndex++; // Move to the next worker for the next request

    // define where the request will be forwarded (proxing the incoming request).
    const options = {
      hostname: 'localhost',
      port: workerPort,
      path: req.url,
      method: req.method,
      headers: req.headers,
    };

    // forward request to another server (proxying it).
    const proxyReq = http.request(options, (proxyRes) => {
      // is executed when the response is received from the server you're forwarding the request to
      res.writeHead(proxyRes.statusCode as number, proxyRes.headers);
      proxyRes.pipe(res, { end: true }); // piping the body of the proxied response to the original client (res).
      // stream will automatically be closed when the piping ends
    });

    req.pipe(proxyReq, { end: true });

    proxyReq.on('error', (err) => {
      console.error(
        `Error forwarding request to worker ${workerPort} ${err.message}`,
      );
      sendResponseJson(res, 500, { message: SERVER_ERROR });
    });
  });

  // Listen on the main port
  loadBalancer.listen(BASE_PORT, () => {
    console.log(`Load balancer listening on port ${BASE_PORT}`);
  });
};

export default loadBalancerServer;
