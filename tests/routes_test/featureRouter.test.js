import request from "supertest";
import express from "express";
import featuresRouter from "../../src/routes/featureRouter.js"; 


jest.mock("../../src/controllers/featureController.js", () => ({
  getFeatures: jest.fn((req, res) => res.status(200).json([{ id: 1, name: "wifi" }])),
}));

describe("Features Router", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/features", featuresRouter);
  });

  it("GET /features повертає список фіч", async () => {
    const response = await request(app).get("/features");

    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.arrayContaining([
      expect.objectContaining({ id: 1, name: "wifi" }),
    ]));
  });
});
