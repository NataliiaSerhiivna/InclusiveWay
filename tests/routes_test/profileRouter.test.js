
import request from "supertest";
import express from "express";

jest.mock("../../src/controllers/userController.js", () => ({
  getUser: jest.fn((req, res) => res.status(200).json({ id: 1, name: "Test User" })),
  editUser: jest.fn((req, res) => res.status(200).json({ message: "User edited" })),
}));

jest.mock("../../src/unitilies/tokenAuthenticationMiddleware.js", () => ({
  authenticateUserToken: (req, res, next) => next(),
  authenticateAdminToken: (req, res, next) => next(),
}));

import profileRouter from "../../src/routes/profileRouter.js";
import { getUser, editUser } from "../../src/controllers/userController.js";

describe("Profile Router", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/profile", profileRouter);
  });

  it("GET /profile should call getUser and return user data", async () => {
    const response = await request(app).get("/profile");
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ id: 1, name: "Test User" });
    expect(getUser).toHaveBeenCalled();
  });

  it("PATCH /profile should call editUser and return success message", async () => {
    const response = await request(app)
      .patch("/profile")
      .send({ name: "Updated Name" });

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "User edited" });
    expect(editUser).toHaveBeenCalled();
  });
});
