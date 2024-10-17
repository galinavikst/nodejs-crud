import { v4 as uuidv4 } from 'uuid';
import { IUser } from '../types';
import { getParsedDb, isValidUserData, writeDataToDb } from '../utils';
import { INVALID_USER_DATA, USER_NOT_FOUND } from '../constatns';

export const findAll = () => {
  return new Promise(async (resolve, reject) => {
    const users = await getParsedDb();
    resolve(users);
  });
};

export const findUser = (id: string) => {
  return new Promise(async (resolve, reject) => {
    const users = await getParsedDb();
    const user = users.find((user: IUser) => user.id === id);
    if (user) resolve(user);
    else reject({ message: USER_NOT_FOUND });
  });
};

export const createUser = (data: string) => {
  return new Promise(async (resolve, reject) => {
    const parsedData = JSON.parse(data);
    const userReqiuredKeys = ['userName', 'age', 'hobbies'];
    const missedKeys = userReqiuredKeys.filter(
      (key) => !Object.keys(parsedData).includes(key),
    );
    if (missedKeys.length) {
      reject({ message: `This keys is required: ${[...missedKeys]}` });
    } else if (!isValidUserData(parsedData)) {
      reject({
        message: INVALID_USER_DATA,
      });
    } else {
      const newUser = { ...parsedData, id: uuidv4() };
      const users = await getParsedDb();
      await writeDataToDb([newUser, ...users]);
      resolve(newUser);
    }
  });
};

export const updateUser = (data: string, id: string) => {
  return new Promise(async (resolve, reject) => {
    const parsedData: Partial<IUser> = JSON.parse(data);
    if (!isValidUserData(parsedData)) {
      reject({
        message: INVALID_USER_DATA,
      });
    } else {
      const users = await getParsedDb();
      const user = users.find((user: IUser) => user.id === id);
      if (user) {
        const updatedUsers = users.map((user: IUser) =>
          user.id === id ? { ...user, ...parsedData } : user,
        );
        await writeDataToDb(updatedUsers);
        const updatedUser = updatedUsers.find((user: IUser) => user.id === id);
        resolve(updatedUser);
      } else {
        reject({ message: USER_NOT_FOUND });
      }
    }
  });
};

export const removeUser = (id: string) => {
  return new Promise(async (resolve, reject) => {
    const users = await getParsedDb();
    const deletedUser = users.find((user: IUser) => user.id === id);
    const updatedUsers = users.filter((user: IUser) => user.id !== id);
    if (deletedUser) {
      await writeDataToDb(updatedUsers);
      resolve(deletedUser);
    } else reject({ message: USER_NOT_FOUND });
  });
};
