import express from "express";
import product from "./routes/productRoutes.js";
import user from "./routes/userRoutes.js";
import order from './routes/orderRoutes.js'
import errorHandleMiddleware from "./middleware/error.js";
import cookieParser from "cookie-parser"; // 5.00.00
import fileUpload from "express-fileupload";

const app = express();

//Middleware
// parse application/json bodies
app.use(express.json());
// also handle form submissions (urlencoded) so req.body isn't undefined when
// the client posts using a HTML form or axios with urlencoded data
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: true,
     tempFileDir: "./tmp/",
  })
);
app.use(cookieParser());
// Route
app.use("/api/v1", product);
app.use("/api/v1", user);
app.use("/api/v1", order); 


// Error Middleware (must be last)
app.use(errorHandleMiddleware);

export default app;
