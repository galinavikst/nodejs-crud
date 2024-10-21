import { USER_NOT_FOUND } from './constatns';
import {
  createUser,
  findAll,
  findUser,
  updateUser,
  removeUser,
} from './models/userModel';
import fs from 'node:fs/promises';
import { IUser } from './types';

jest.mock('node:fs/promises');

describe('GET', () => {
  const id = '92155ba8-6717-44c4-a93b-39e3496a4e71';
  const user = {
    age: 15,
    hobbies: ['hi', 'hello'],
    userName: 'test2',
    id,
  };
  const db = JSON.stringify([user, {}]);

  // using different aproaches to resolve/reject promise
  test('Get all records with a GET api/users request (an empty array is expected)', async () => {
    const res = JSON.stringify([]);
    jest.spyOn(fs, 'readFile').mockResolvedValue(Buffer.from(res));
    const data = await findAll();
    expect(data).toEqual(JSON.parse(res));
  });

  test('GET api/user/{userId} request, get the created record by its id (the created record is expected)', async () => {
    jest.spyOn(fs, 'readFile').mockResolvedValue(Buffer.from(db));
    expect(findUser(id)).resolves.toEqual(user);
  });

  test('GET api/users/{userId} request, get a deleted object by id (expected answer is that there is no such object)', async () => {
    const notExistedId = '92155ba8-6717-44c4-a93b-39e3496a4e44';
    jest.spyOn(fs, 'readFile').mockResolvedValue(Buffer.from(db));
    try {
      await findUser(notExistedId);
    } catch (error) {
      expect(error).toEqual({ message: USER_NOT_FOUND });
    }
  });
});

describe('POST', () => {
  const db = JSON.stringify([]);
  jest.spyOn(fs, 'readFile').mockResolvedValue(Buffer.from(db));
  test('A new object is created by a POST api/users request (a response containing newly created record)', async () => {
    const newUserData = {
      age: 111,
      hobbies: [],
      userName: 'newName',
    };
    const createdUser = await createUser(JSON.stringify(newUserData));
    expect(createdUser).toMatchObject(newUserData);
    expect(createdUser).toHaveProperty('id');
  });
});

describe('PUT', () => {
  test('update the created record with a PUT api/users/{userId}request (a response is containing an updated object with the same id)', async () => {
    const user = {
      age: 111,
      hobbies: [],
      userName: 'newName',
      id: '92155ba8-6717-44c4-a93b-39e3496a4e71',
    };
    const db = JSON.stringify([user, {}]);
    const newUserData = {
      hobbies: ['hi', 'hello'],
    };
    jest.spyOn(fs, 'readFile').mockResolvedValue(Buffer.from(db));
    const updatedUser = (await updateUser(
      JSON.stringify(newUserData),
      user.id,
    )) as IUser;
    expect(updatedUser.hobbies).toEqual(newUserData.hobbies);
    expect(updatedUser.id).toBe(user.id);
  });
});

describe('DELETE', () => {
  test('DELETE api/users/{userId} request, delete the created object by id (confirmation of successful deletion is expected)', async () => {
    const user = {
      age: 111,
      hobbies: [],
      userName: 'newName',
      id: '92155ba8-6717-44c4-a93b-39e3496a4e71',
    };
    const db = JSON.stringify([user, {}]);
    jest.spyOn(fs, 'readFile').mockResolvedValue(Buffer.from(db));
    const deletedUser = await removeUser(user.id);
    expect(JSON.parse(db)).not.toContain(deletedUser);
  });
});
