import app from "./app.js";
import dotenv from "dotenv";
import { connectMongoDataBase } from "./config/db.js";

dotenv.config({ path: "./backend/config/config.env" });
import { v2 as cloudinary } from "cloudinary";
connectMongoDataBase();
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  //  secure: true,
});

// Handling expection error
// console.log(myName);
process.on("uncaughtException", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server is shutting down, due to uncaught exception`);
  process.exit(1); // NO NEED TO CLOSE THE SERVER JUST GET OUT OF THE PROCESS
});
// console.log(app);
const port = process.env.PORT || 3000;

console.log("DB_URI =", process.env.DB_URI);
// app.get("/api/v1/products", (req, res) => {
//   res.status(200).json({
//     message: "All products"
//   });
// }); This is refracted code for below code

const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// PROMISE ERROR

process.on("unhandledRejection", (err) => {
  console.log(`Error: ${err.message}`);
  console.log(`Server is shutting down, due to unhandled promise rejection`);
  server.close(() => {
    process.exit(1);
  });
});
