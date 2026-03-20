import mongoose from "mongoose";

export const connectMongoDataBase = () => {
  mongoose.connect(process.env.DB_URI)
  .then((data) => {
    console.log(`MongoDb connected with server ${data.connection.host}`);
  })

  // THIS IS HANDLED IN SERVER.JS UNHANDLED ERROR
  // .catch((err) => {
  //   console.log(err.message);
  // })
}
