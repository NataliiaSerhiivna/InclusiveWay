import request from "supertest";
import express from "express";

jest.mock("../../src/controllers/userController.js", () => ({
  getUsers: jest.fn((req, res) => res.status(200).json([{ id: 1, email: "user@example.com" }])),
}));

jest.mock("../../src/unitilies/tokenAuthenticationMiddleware.js", () => ({
  authenticateAdminToken: jest.fn((req, res, next) => next()),
}));

import router from "../../src/routes/userRouter.js";  // підкоригуй шлях під себе
import { getUsers } from "../../src/controllers/userController.js";
import { authenticateAdminToken } from "../../src/unitilies/tokenAuthenticationMiddleware.js";

describe("User Router GET /", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/users", router);
  });

  it("should call authenticateAdminToken and getUsers on GET /users", async () => {
    const response = await request(app).get("/users");

    expect(response.status).toBe(200);
    expect(response.body).toEqual([{ id: 1, email: "user@example.com" }]);
    expect(authenticateAdminToken).toHaveBeenCalled();
    expect(getUsers).toHaveBeenCalled();
  });
});
