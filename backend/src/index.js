import express from "express";
import "dotenv/config";
import cookieParser from "cookie-parser";
import cors from "cors";
import locationsRouter from "./routes/locationsRouter.js";
import signupRouter from "./routes/signupRouter.js";
import loginRouter from "./routes/loginRouter.js";
import authRouter from "./routes/authRouter.js";
import featureRouter from "./routes/featureRouter.js";
import photosRouter from "./routes/photosRouter.js";
import profileRouter from "./routes/profileRouter.js";
import userRouter from "./routes/userRouter.js";

import editRequestRouter from "./routes/locationEditRequestRouter.js";
const app = express();

app.use(
  cors({
    origin: "https://inclusivewayclient.onrender.com",
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());

app.use("/locations", locationsRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/auth", authRouter);
app.use("/features", featureRouter);
app.use("/photos", photosRouter);
app.use("/profile", profileRouter);
app.use("/users", userRouter);
app.use("/location-edit-requests", editRequestRouter);
app.use(cookieParser());

const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>
  console.log(`server is running on http://localhost:${PORT}`)
);
