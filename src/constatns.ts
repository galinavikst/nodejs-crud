import os from 'node:os';

export const ROUTES: { [key: string]: string } = {
  get: '/api/users',
  post: '/api/users',
  put: '/api/users/',
  delete: '/api/users/',
};

export const BASE_PORT = os.availableParallelism() * 1000;
export const NUM_CPUS = os.availableParallelism();
export const USER_REQUIRED_KEYS: string[] = ['userName', 'age', 'hobbies'];

export const INVALID_ID = 'User Id is invalid';
export const USER_NOT_FOUND = 'User not found';
export const INVALID_USER_DATA = 'Invalid user data';
export const SERVER_ERROR = 'Internal Server Error';
