import users from '../db';

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
