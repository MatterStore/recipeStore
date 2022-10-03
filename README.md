# RecipeStore

### Members

* Daniel Blaker - `5Mixer`
* Jade Siang - `jadesiang`
* Owen Feik - `OwenFeik`
* Manu Masson - `manu354`
* Paul Hutchins - `hutchinsp01`

### Requirements

1. NodeJS - [Install](https://nodejs.org/en/download/)

## Local Development

0. Specify environment variables in a `.env` file:

```bash
cp .env.template .env
```

to connect to the database you will have to set the correct atlas username and password in the `.env` file.

1. Install npm packages:

```bash
npm install
```

2. Run the app with `npm run dev`, this will open the application on

```
http://localhost:3000
```

The Backend APIs can be triggered by hitting the following URL:

```
http://localhost:5000
```

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

### Security

1. [Bcrypt](https://www.npmjs.com/package/bcrypt) is used for storing hashed passwords.
2. [Passport-JWT](https://www.npmjs.com/package/passport-jwt) is used for session management.
3. The [Joi](https://www.npmjs.com/package/joi) library is used for checking and validating the params for any given Express request.

### Backend

1. Environment files are executed from .env for local development with [Dotenv](https://www.npmjs.com/package/dotenv).
2. [Mongoose](https://www.npmjs.com/package/mongoose) is used as an object modelling framework for MongoDB.
