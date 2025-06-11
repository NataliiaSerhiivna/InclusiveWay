
import request from "supertest";
import express from "express";

jest.mock("../../src/controllers/userController.js", () => ({
  createUser: jest.fn((req, res) =>
    res.status(201).json({ message: "User created" })
  ),
}));

import createUserRouter from "../../src/routes/signupRouter.js"; 
import { createUser } from "../../src/controllers/userController.js";

describe("CreateUser Router", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/user", createUserRouter);
  });

  it("POST /user - викликає createUser та повертає 201", async () => {
    const response = await request(app)
      .post("/user")
      .send({ username: "newuser", password: "newpass" });

    expect(response.status).toBe(201);
    expect(response.body).toEqual({ message: "User created" });
    expect(createUser).toHaveBeenCalled();
  });
});
