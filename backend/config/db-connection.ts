import mongoose from "mongoose";

export default function connect() {
  const DB_USER = process.env.DB_USER;
  const DB_PASSWORD = process.env.DB_PASSWORD;
  
  const DB_HOST_PROD = "cluster0.jd0lpeu.mongodb.net";
  const DB_HOST_TEST = "cluster0.jd0lpeu.mongodb.net";
  const DB_HOST = process.env.NODE_ENV == "testing" ? DB_HOST_TEST : DB_HOST_PROD; 
  
  const DB_URL = `mongodb+srv://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/?retryWrites=true&w=majority`;
  
  console.log(DB_URL);
  
  const mongoOpts : any = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  };
  mongoose.connect(DB_URL, mongoOpts);  
}
