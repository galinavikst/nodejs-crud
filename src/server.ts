import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';
import fs from 'node:fs/promises';
import os from 'node:os';
import path from 'node:path';
import http from 'node:http';
import { getAllUsers, getUser } from './controllers/userController';

const start = async (): Promise<void> => {
  console.log(`Here is a UUID: ${uuidv4()}`);

  const pathToEnv = path.join(process.cwd(), '.env');
  const port = os.availableParallelism() * 1000;
  await fs.writeFile(pathToEnv, `PORT=${port.toString()}`);

  dotenv.config();
  console.log(process.env.PORT);

  const server = http.createServer(async (req, res) => {
    const { method, url, headers } = req;
    console.log(method, url, headers);

    req
      .on('error', (err) => {
        console.log(err.stack);
        res.statusCode = 400;
        res.end();
      })
      .on('data', (chunk) => {
        console.log(chunk);
      })
      .on('end', async () => {
        console.log('request end\n');

        if (req.method === 'GET' && req.url === '/api/users') {
          await getAllUsers(req, res);
          return;
        } else if (req.method === 'GET' && req.url?.startsWith('/api/users/')) {
          const uuid = req.url?.split('/')[3];
          await getUser(req, res, uuid);
        } else {
        }
      });
  });

  server.listen(process.env.PORT || port, () =>
    console.log('Server running on port: ', process.env.PORT || port),
  );
};

start();
