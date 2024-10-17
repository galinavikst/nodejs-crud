export interface IUser {
  id: string;
  userName: string;
  age: number;
  hobbies: string[];
}

export interface IRoutes {
  get: string;
  post: string;
  put: string;
  delete: string;
}

export interface IErrorMessage {
  message: string;
}
