# CRUD API

## Description

Simple CRUD API using in-memory database underneath.

## Technolgy

- Implemented on Typescript
- `nodemon`, `dotenv`, `cross-env`, `typescript`, `ts-node`, `ts-node-dev`, `eslint` and its plugins, `webpack-cli`, `webpack` and its plugins, `prettier`, `uuid`, `@types/*` as well as libraries used
- 22.x.x version (22.9.0 or upper) of Node.js
- Asynchronous API whenever possible

## Installation

1. **Clone the repository:**

   ```bash
   git clone https://github.com/galinavikst/nodejs-crud.git
   ```

2. **Navigate to the project directory:**

   ```bash
   cd nodejs-crud
   ```

3. **Install the dependencies:**

   ```bash
   npm install
   ```

4. **Start the server:**

   ```bash
   npm run start:dev
   ```

   or

   ```bash
   npm run start:prod
   ```

   or

   ```bash
   npm run start:multi
   ```

> [!NOTE]
>
> ### Use postman for sending requests

## Implementation details

1. Implemented endpoint `api/users`:
   - **GET** `api/users` is used to get all persons
     - Server answer with `status code` **200** and all users records
   - **GET** `api/users/{userId}`
     - Server answer with `status code` **200** and record with `id === userId` if it exists
     - Server answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
     - Server answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
   - **POST** `api/users` is used to create record about new user and store it in database
     - Server answer with `status code` **201** and newly created record
     - Server answer with `status code` **400** and corresponding message if request `body` does not contain **required** fields
   - **PUT** `api/users/{userId}` is used to update existing user
     - Server answer with` status code` **200** and updated record
     - Server answer with` status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
     - Server answer with` status code` **404** and corresponding message if record with `id === userId` doesn't exist
   - **DELETE** `api/users/{userId}` is used to delete existing user from database
     - Server answer with `status code` **204** if the record is found and deleted
     - Server answer with `status code` **400** and corresponding message if `userId` is invalid (not `uuid`)
     - Server answer with `status code` **404** and corresponding message if record with `id === userId` doesn't exist
2. Users are stored as `objects` that have following properties:
   - `id` — unique identifier (`string`, `uuid`) generated on server side
   - `username` — user's name (`string`, **required**)
   - `age` — user's age (`number`, **required**)
   - `hobbies` — user's hobbies (`array` of `strings` or empty `array`, **required**)
3. Requests to non-existing endpoints (e.g. `some-non/existing/resource`) is handled (server answer with `status code` **404** and corresponding human-friendly message)
4. Errors on the server side that occur during the processing of a request is handled and processed correctly (server answer with `status code` **500** and corresponding human-friendly message)
5. Value of `port` on which application is running stored in `.env` file
6. There is 2 modes of running application (**development** and **production**):
   - The application is run in development mode using `nodemon` (there is a `npm` script `start:dev`)
   - The application is run in production mode (there is a `npm` script `start:prod` that starts the build process and then runs the bundled file)
7. There is some tests for API:
   1. Get all records with a `GET` `api/users` request (an empty array is expected)
   2. A new object is created by a `POST` `api/users` request (a response containing newly created record is expected)
   3. With a `GET` `api/user/{userId}` request, we try to get the created record by its `id` (the created record is expected)
   4. We try to update the created record with a `PUT` `api/users/{userId}`request (a response is expected containing an updated object with the same `id`)
   5. With a `DELETE` `api/users/{userId}` request, we delete the created object by `id` (confirmation of successful deletion is expected)
   6. With a `GET` `api/users/{userId}` request, we are trying to get a deleted object by `id` (expected answer is that there is no such object)
8. Implemented horizontal scaling for application, there is `npm` script `start:multi` that starts multiple instances of the application using the Node.js `Cluster` API (equal to the number of available parallelism - 1 on the host machine, each listening on port PORT + n) with a **load balancer** that distributes requests across them (using Round-robin algorithm). For example: available parallelism is 4, `PORT` is 4000. On run `npm run start:multi` it works following way

- On `localhost:4000/api` load balancer is listening for requests
- On `localhost:4001/api`, `localhost:4002/api`, `localhost:4003/api` workers are listening for requests from load balancer
- When user sends request to `localhost:4000/api`, load balancer sends this request to `localhost:4001/api`, next user request is sent to `localhost:4002/api` and so on.
- After sending request to `localhost:4003/api` load balancer starts from the first worker again (sends request to `localhost:4001/api`)
- State of db is consistent between different workers, for example:
  1. First `POST` request addressed to `localhost:4001/api` creates user
  2. Second `GET` request addressed to `localhost:4002/api` return created user
  3. Third `DELETE` request addressed to `localhost:4003/api` deletes created user
  4. Fourth `GET` request addressed to `localhost:4001/api` return **404** status code for created user
