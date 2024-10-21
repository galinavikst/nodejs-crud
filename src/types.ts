import { IncomingMessage, ServerResponse } from 'http';

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

export interface IServerArgs {
  req: IncomingMessage;
  res: ServerResponse<IncomingMessage> & { req: IncomingMessage };
}

export interface IServerArgsId extends IServerArgs {
  id: string;
}
