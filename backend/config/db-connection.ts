import dotenv from 'dotenv';
dotenv.config({ path: `.env` });

import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

const DB_USER = process.env.DB_USER;
const DB_PASSWORD = process.env.DB_PASSWORD;
const DB_HOST =
  process.env.NODE_ENV == 'testing'
    ? 'cluster0.rvya9b7.mongodb.net'
    : 'cluster0.jd0lpeu.mongodb.net';
const DB_URL =
  `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}` + '/?retryWrites=true&w=majority';

const mongoOpts: unknown = {
  useNewUrlParser: true,
  useUnifiedTopology: true
};

if (process.env.NODE_ENV == 'testing') {
  MongoMemoryServer.create().then((mongodb) => mongoose.connect(mongodb.getUri(), mongoOpts));
} else {
  mongoose.connect(DB_URL, mongoOpts);
}

export default {};
