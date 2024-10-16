import dotenv from 'dotenv';
import { v4 as uuidv4 } from 'uuid';

dotenv.config();

const start = (): void => {
  console.log(process.env.PORT);
  console.log(`Hello World! Here is a UUID: ${uuidv4()}`);
};

start();
