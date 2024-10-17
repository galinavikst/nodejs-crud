import { validate as isValidUuid } from 'uuid';
import * as Users from '../models/userModel';
import { IServerArgs, IServerArgsId, IErrorMessage, IUser } from '../types';
import { sendResponseJson } from '../utils';
import { INVALID_ID } from '../constatns';

export const getAllUsers = async ({ req, res }: IServerArgs) => {
  try {
    const usersRespose = await Users.findAll();
    sendResponseJson(res, 200, usersRespose as IUser[]);
  } catch (error) {
    console.log(error);
    sendResponseJson(res, 500, error as IErrorMessage);
  }
};

export const getUser = async ({ req, res, id }: IServerArgsId) => {
  try {
    if (!isValidUuid(id)) {
      sendResponseJson(res, 400, { message: INVALID_ID } as IErrorMessage);
    } else {
      const user = await Users.findUser(id);
      sendResponseJson(res, 200, user as IUser);
    }
  } catch (error) {
    sendResponseJson(res, 404, error as IErrorMessage); // user not found or iInvalid user data
  }
};

export const postUser = async ({ req, res }: IServerArgs) => {
  try {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        const newUser = await Users.createUser(body);
        sendResponseJson(res, 201, newUser as IUser);
      } catch (error) {
        sendResponseJson(res, 400, error as IErrorMessage); // body does not contain required fields or invalid data
      }
    });
  } catch (error) {
    console.log('control post', error);
    sendResponseJson(res, 500, error as IErrorMessage);
  }
};

export const putUser = async ({ req, res, id }: IServerArgsId) => {
  try {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk.toString();
    });
    req.on('end', async () => {
      try {
        if (!isValidUuid(id)) {
          sendResponseJson(res, 400, { message: INVALID_ID } as IErrorMessage);
        } else {
          const updatedUser = await Users.updateUser(body, id);
          sendResponseJson(res, 201, updatedUser as IUser);
        }
      } catch (error) {
        sendResponseJson(res, 400, error as IErrorMessage); // invalide user data
      }
    });
  } catch (error) {
    console.log('control post', error);
    sendResponseJson(res, 500, error as IErrorMessage);
  }
};

export const deleteUser = async ({ req, res, id }: IServerArgsId) => {
  try {
    if (!isValidUuid(id)) {
      sendResponseJson(res, 400, { message: INVALID_ID } as IErrorMessage);
    } else {
      const user = await Users.removeUser(id);
      sendResponseJson(res, 200, user as IUser);
    }
  } catch (error) {
    sendResponseJson(res, 404, error as IErrorMessage); // user not found
  }
};
