import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import path from 'node:path';
import http from 'node:http';
import cluster from 'node:cluster';
import {
  deleteUser,
  getAllUsers,
  getUser,
  postUser,
  putUser,
} from './controllers/userController';
import { getIdFromRequest, sendResponseJson } from './utils';
import { BASE_PORT, NUM_CPUS, ROUTES, SERVER_ERROR } from './constatns';
import loadBalancerServer from './loadBalancerServer';

const start = async (): Promise<void> => {
  const pathToEnv = path.join(process.cwd(), '.env');
  await fs.writeFile(pathToEnv, `PORT=${BASE_PORT.toString()}`);

  dotenv.config();

  if (process.env.CLUSTER_MODE && cluster.isPrimary) {
    console.log(
      `Primary ${process.pid} is running on port ${process.env.PORT}.`,
    );

    let workerIndex = 0; // To track the current worker
    // create workers and assign unique ports
    for (let i = 0; i < NUM_CPUS - 1; i++) {
      cluster.fork({ PORT: BASE_PORT + i + 1 }); // Assign ports in env +1, +2, etc.
    }

    // Round-robin load balancer
    loadBalancerServer(workerIndex);

    cluster.on('exit', (worker, code, signal) => {
      console.log(
        `Worker ${worker.process.pid} died, code: ${code}, signal: ${signal}`,
      );
    });
  } else {
    const server = http.createServer(async (req, res) => {
      try {
        console.log(req.method, req.url);

        if (req.method === 'GET' && req.url === ROUTES.get) {
          await getAllUsers({ req, res });
        } else if (req.method === 'GET' && req.url?.startsWith(ROUTES.get)) {
          const uuid = getIdFromRequest(req);
          await getUser({ req, res, id: uuid as string });
        } else if (req.method === 'POST' && req.url === ROUTES.post) {
          await postUser({ req, res });
        } else if (req.method === 'PUT' && req.url?.startsWith(ROUTES.put)) {
          const uuid = getIdFromRequest(req);
          await putUser({ req, res, id: uuid as string });
        } else if (
          req.method === 'DELETE' &&
          req.url?.startsWith(ROUTES.delete)
        ) {
          const uuid = getIdFromRequest(req);
          await deleteUser({ req, res, id: uuid as string });
        } else {
          sendResponseJson(res, 404, { message: 'Route not found' });
        }
      } catch (error) {
        console.log('server error', error);
        sendResponseJson(res, 500, { message: SERVER_ERROR });
      }
    });

    server.listen(process.env.PORT || BASE_PORT, () => {
      console.log(
        'Server running on port: ',
        `${process.env.PORT || BASE_PORT}`,
      );
    });

    console.log(`Worker ${process.pid} started`);
  }
};

start().catch((err) => console.error(err));
