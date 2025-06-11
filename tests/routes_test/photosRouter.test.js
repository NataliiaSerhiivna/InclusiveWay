import request from "supertest";
import express from "express";

jest.mock("../../src/controllers/photosController.js", () => ({
  deleteLocationPhoto: jest.fn((req, res) => res.status(200).json({ message: "Photo deleted" })),
}));

jest.mock("../../src/unitilies/tokenAuthenticationMiddleware.js", () => ({
  authenticateAdminToken: jest.fn((req, res, next) => next()),  
  authenticateUserToken: jest.fn(), 
}));

import router from "../../src/routes/photosRouter.js";  

describe("Photos Router DELETE /:id", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/photos", router);
  });

  it("should call authenticateAdminToken and deleteLocationPhoto on DELETE /photos/:id", async () => {
    const response = await request(app)
      .delete("/photos/123");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({ message: "Photo deleted" });
  });
});
