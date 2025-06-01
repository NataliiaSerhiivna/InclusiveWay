import express from "express";
import "dotenv/config";
import locationsRouter from "./routes/locations.js";
import signupRouter from "./routes/signup.js";
import loginRouter from "./routes/login.js";

const app = express();

app.use(express.json());
app.use("/locations", locationsRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);

const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>
  console.log(`server is running on http://localhost:${PORT}`)
);
