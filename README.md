# Kanban Board

A small Kanban board built with the MERN stack (MongoDB, Express, React, Node).

Register an account, create boards and move tasks between **TODO**, **IN PROGRESS**
and **DONE**. Every board and task belongs to the user who created it.

## Features

- Register, log in and log out with JWT authentication
- Passwords hashed with bcrypt, never returned by the API
- Protected client routes and protected API endpoints
- Create, edit, delete and open boards
- Create, edit and delete tasks on a board
- Move a task between the three columns with a simple dropdown
- LOW / MEDIUM / HIGH priorities, shown as a coloured badge and sorted to the top
- Ownership checks on every board and task request
- Responsive layout that stacks the columns on small screens

## Tech stack

**Front end:** React, React Router, Axios, the Context API and SCSS
**Back end:** Node.js, Express, MongoDB, Mongoose, JSON Web Tokens and bcrypt
**Tests:** Jest and Supertest against an in-memory MongoDB

## Pages

| Route         | Description                               |
| ------------- | ----------------------------------------- |
| `/login`      | Log in to an existing account             |
| `/register`   | Create a new account                      |
| `/dashboard`  | The boards belonging to the logged in user |
| `/boards/:id` | The Kanban columns and tasks for a board  |

## Project structure

```
kanban-board/
├── client/                 React front end
│   ├── public/
│   └── src/
│       ├── api/            Axios instance and token interceptor
│       ├── components/     Navbar, cards, forms, Kanban column
│       ├── context/        AuthContext (Context API)
│       ├── pages/          Login, Register, Dashboard, BoardPage
│       └── styles/         SCSS partials
└── server/                 Express REST API
    ├── config/             MongoDB connection
    ├── controllers/        Route handlers
    ├── middleware/         Auth guard, validation, error handling
    ├── models/             User, Board and Task schemas
    ├── routes/             Route definitions
    └── tests/              Jest and Supertest suites
```

## Getting started

### Prerequisites

- Node.js 14 or newer
- MongoDB running locally, or a MongoDB Atlas connection string

### 1. Install the dependencies

```bash
npm run install-all
```

That installs the root, server and client packages. You can also run
`npm install` inside `server/` and `client/` yourself.

### 2. Configure the environment

Copy the example file and fill in your own values:

```bash
cp server/.env.example server/.env
```

| Variable         | Description                                  |
| ---------------- | -------------------------------------------- |
| `PORT`           | Port for the Express server (default `5000`) |
| `MONGO_URI`      | MongoDB connection string                    |
| `JWT_SECRET`     | Secret used to sign tokens, keep it private  |
| `JWT_EXPIRES_IN` | Token lifetime, for example `7d`             |

`server/.env` is git ignored, so your secrets stay out of the repository.

### 3. Run the app

```bash
npm run dev
```

The API starts on <http://localhost:5000> and the React app on
<http://localhost:3000>. The client proxies `/api` to the server, so there is
nothing else to configure in development.

To run them separately:

```bash
npm run server
npm run client
```

## Scripts

| Command               | What it does                                 |
| --------------------- | -------------------------------------------- |
| `npm run dev`         | Runs the API and the React app together      |
| `npm run server`      | Runs the Express API only                    |
| `npm run client`      | Runs the React development server only       |
| `npm test`            | Runs the server test suite                   |
| `npm run install-all` | Installs root, server and client packages    |

Inside `client/`, `npm run build` produces the production bundle.

## API

All board and task endpoints need an `Authorization: Bearer <token>` header.

### Auth

| Method | Endpoint             | Description                      |
| ------ | -------------------- | -------------------------------- |
| POST   | `/api/auth/register` | Create an account, returns a JWT |
| POST   | `/api/auth/login`    | Log in, returns a JWT            |
| GET    | `/api/auth/me`       | The currently logged in user     |

### Boards

| Method | Endpoint           | Description              |
| ------ | ------------------ | ------------------------ |
| GET    | `/api/boards`      | List your boards         |
| POST   | `/api/boards`      | Create a board           |
| GET    | `/api/boards/:id`  | Get a single board       |
| PUT    | `/api/boards/:id`  | Update a board           |
| DELETE | `/api/boards/:id`  | Delete a board and tasks |

### Tasks

| Method | Endpoint                       | Description            |
| ------ | ------------------------------ | ---------------------- |
| GET    | `/api/boards/:boardId/tasks`   | List the board's tasks |
| POST   | `/api/boards/:boardId/tasks`   | Add a task to a board  |
| PUT    | `/api/tasks/:id`               | Edit, move or reprioritise a task |
| DELETE | `/api/tasks/:id`               | Delete a task          |

### Status codes

| Code | When                                            |
| ---- | ----------------------------------------------- |
| 200  | Successful read, update or delete               |
| 201  | A user, board or task was created               |
| 400  | Validation failed or the id in the URL is invalid |
| 401  | Missing, invalid or expired token, bad login    |
| 403  | The resource belongs to another user            |
| 404  | No such board, task or route                    |
| 500  | Unexpected server error                         |

### Example

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Santosh","email":"me@example.com","password":"secret123"}'

curl http://localhost:5000/api/boards \
  -H "Authorization: Bearer <token>"
```

## Data models

**User** — `name`, `email` (unique), `password` (hashed, never returned)

**Board** — `title`, `description`, `owner` (User reference)

**Task** — `title`, `description`, `status`, `priority`, `board` (Board
reference), `owner` (User reference)

`status` is stored as `TODO`, `IN_PROGRESS` or `DONE`; the middle one is shown
as "IN PROGRESS" in the interface. `priority` is `LOW`, `MEDIUM` or `HIGH`.
Deleting a board also deletes its tasks.

## Tests

```bash
cd server
npm test
```

The suite covers registration, login, the token guard, board and task CRUD, the
validation rules and the ownership checks. It spins up an in-memory MongoDB, so
no database setup is needed. To run it against a real database instead:

```bash
MONGO_URI_TEST=mongodb://localhost:27017/kanban_test npm test
```

## Notes

Moving a task is a status change from a dropdown rather than drag and drop, which
keeps the front end small and the API straightforward.

## License

MIT
