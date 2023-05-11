import express from "express";
import connection from "./config/connection_db.js";
import morgan from "morgan";
import cors from "cors";
import {handleErrors} from "./HandlingError/HandleError.js";
import User from "./route/userRouter.js"; // import User model
import Social from "./route/socialRoute.js"
const app = express();
const port = process.env.PORT || 3000;

connection();

app.use(morgan("dev"));

// app.use("/", (req, res) => {
//   console.log("API is Running!");
// });
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/uploads", express.static("uploads"));
app.use(handleErrors);

app.use("/api/user", User);
app.use("/api/social", Social);


app.listen(port, () => {
  console.log(`Hello World 🫠️, On: http://localhost:${port}`);
});
