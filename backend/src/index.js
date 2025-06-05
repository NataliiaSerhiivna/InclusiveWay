import express from "express";
import "dotenv/config";
import locationsRouter from "./routes/locationsRouter.js";
import signupRouter from "./routes/signupRouter.js";
import loginRouter from "./routes/loginRouter.js";
import featureRouter from "./routes/featureRouter.js";
import photosRouter from "./routes/photosRouter.js";
const app = express();

app.use(express.json());
app.use("/locations", locationsRouter);
app.use("/signup", signupRouter);
app.use("/login", loginRouter);
app.use("/features", featureRouter);
app.use("/photos", photosRouter);
const PORT = process.env.PORT || 8080;

app.listen(PORT, () =>
  console.log(`server is running on http://localhost:${PORT}`)
);
