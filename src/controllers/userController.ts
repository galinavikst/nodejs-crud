import { IncomingMessage, ServerResponse } from 'http';
import { validate as isValidUuid } from 'uuid';
import * as Users from '../models/userModel';

export const getAllUsers = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & { req: IncomingMessage },
) => {
  try {
    const usersRespose = await Users.findAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(usersRespose));
  } catch (error) {
    console.log(error);
  }
};

export const getUser = async (
  req: IncomingMessage,
  res: ServerResponse<IncomingMessage> & { req: IncomingMessage },
  id: string,
) => {
  try {
    if (!isValidUuid(id)) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ message: 'User Id is invalid' }));
    } else {
      const user = await Users.findUser(id);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(user));
    }
  } catch (error) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(error)); // user not found
  }
};
