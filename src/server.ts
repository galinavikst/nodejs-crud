import dotenv from 'dotenv';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import {
  deleteUser,
  getAllUsers,
  getUser,
  postUser,
  putUser,
} from './controllers/userController';
import { getIdFromRequest, sendResponseJson } from './utils';
import { ROUTES } from './constatns';

const start = async (): Promise<void> => {
  const pathToEnv = path.join(process.cwd(), '.env');
  const port = os.availableParallelism() * 1000;
  await fs.writeFile(pathToEnv, `PORT=${port.toString()}`);

  dotenv.config();

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
      sendResponseJson(res, 500, { message: 'Server error' });
    }
  });

  server.listen(process.env.PORT || port, () =>
    console.log('Server running on port: ', process.env.PORT || port),
  );
};

start();
