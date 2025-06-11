import request from "supertest";
import express from "express";

jest.mock("../../src/unitilies/tokenAuthenticationMiddleware.js", () => ({
  authenticateAdminToken: jest.fn((req, res, next) => next()),
}));

jest.mock("../../src/controllers/userController.js", () => ({
  getUsers: jest.fn((req, res) => res.status(200).json([{ id: 1, name: "User1" }])),
}));

import userRouter from "../../src/routes/userRouter.js";

describe("User Router GET /", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/user", userRouter);
  });

  it("should call getUsers and return list of users", async () => {
    const response = await request(app).get("/user");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, name: "User1" }]);
  });
});
