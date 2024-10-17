import { IncomingMessage, ServerResponse } from 'node:http';
import { IErrorMessage, IUser } from './types';
import fs from 'node:fs/promises';

export const getIdFromRequest = (req: IncomingMessage) =>
  req.url?.split('/')[3];

export const isValidUserData = (user: Partial<IUser>) => {
  // if there is no such key in user obj - it will skip the statement (post/put)
  if ('userName' in user) {
    if (typeof user.userName !== 'string' || user.userName.trim() === '') {
      return false;
    }
  }

  if ('age' in user) {
    if (typeof user.age !== 'number' || user.age <= 0) {
      return false;
    }
  }

  if ('hobbies' in user) {
    if (
      !Array.isArray(user.hobbies) ||
      !user.hobbies.every((hobby) => typeof hobby === 'string')
    ) {
      return false;
    }
  }

  return true;
};

export const getParsedDb = async () => {
  try {
    const data = await fs.readFile('./src/db.json', { encoding: 'utf-8' });
    return JSON.parse(data);
  } catch (error) {
    console.log('parse db', error);
  }
};

export const writeDataToDb = async (data: IUser[]) => {
  try {
    await fs.writeFile('./src/db.json', JSON.stringify(data));
  } catch (error) {
    console.log('writing data to db', error);
  }
};

export const sendResponseJson = (
  res: ServerResponse<IncomingMessage> & { req: IncomingMessage },
  code: number,
  data: Partial<IUser> | IUser | IUser[] | IErrorMessage,
) => {
  res.writeHead(code, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(data));
};
