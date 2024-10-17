import users from '../db';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../types';
import { isValidUserData } from '../utils';

export const findAll = () => {
  return new Promise((resolve, reject) => {
    resolve(users);
  });
};

export const findUser = (id: string) => {
  return new Promise((resolve, reject) => {
    const user = users.find((user) => user.id === id);
    if (user) resolve(user);
    else reject({ message: 'User not found' });
  });
};

export const createUser = (data: string) => {
  return new Promise((resolve, reject) => {
    const parsedData = JSON.parse(data);
    const userReqiuredKeys = ['userName', 'age', 'hobbies'];

    const missedKeys = userReqiuredKeys.filter(
      (key) => !Object.keys(parsedData).includes(key),
    );

    if (missedKeys.length) {
      reject({ message: `This keys is required: ${[...missedKeys]}` });
    } else if (!isValidUserData(parsedData)) {
      reject({
        message: 'Invalid user data',
      });
    } else {
      const newUser = { ...parsedData, id: uuidv4() };
      users.push(newUser);
      resolve(newUser);
    }
  });
};
