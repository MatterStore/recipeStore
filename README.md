# RecipeStore

### Requirements

1. NodeJS - [Install](https://nodejs.org/en/download/)

### Technologies Used

- React (v18)
- Node (v16)
- Express (v4)
- MongoDB (latest)

### Folder Structure

```project-root/
  ├── backend/
  │   └── ...
  └── frontend/
  │   └── ...
```

## Features

### Security

1. [Bcrypt](https://www.npmjs.com/package/bcrypt) is used for storing hashed passwords.
2. [Passport-JWT](https://www.npmjs.com/package/passport-jwt) is used for session management.
3. The [Joi](https://www.npmjs.com/package/joi) library is used for checking and validating the params for any given Express request.
4. Only the Backend (NodeJS) container has access to the Database (MongoDB) container.

### Architecture

1. Mounted volumes for both Frontend and the Backend for ease of development.
2. TODO

### Backend

1. Environment files have been setup separately for development and production using [Dotenv](https://www.npmjs.com/package/dotenv).
2. [Mongoose](https://www.npmjs.com/package/mongoose) is used as an object modelling framework for MongoDB.
3. [Nodemon](https://www.npmjs.com/package/nodemon) is used to serve the Node application on the local environment for automatic reloading.

### Frontend

1. React-Router enabled.
2. Axios enabled and configured as an custom interceptor that can send requests with a JWT token.
3. React-Tostify used for showing success / error messages. ??? Maybe

## Local Development

1. Run the following command in both `frontend` & `backend` directories:

```bash
npm install
```

2. To build the frontend run `cd frontend && npm install && npm run build`

3. Run the server with `npm start`

4. The Backend APIs can be triggered by hitting the following URL:

```
http://localhost:5000
```

4. [WIP] You can also run the frontend seperately with `cd frontend && npm start`

You are all set!
