import { User } from './types';

export const isValidUserData = (user: User) => {
  // Check required fields and types
  if (typeof user.userName !== 'string' || user.userName.trim() === '') {
    return false;
  }
  if (typeof user.age !== 'number' || user.age <= 0) {
    return false;
  }
  if (
    !Array.isArray(user.hobbies) ||
    !user.hobbies.every((hobby) => typeof hobby === 'string')
  ) {
    return false;
  }
  return true;
};
