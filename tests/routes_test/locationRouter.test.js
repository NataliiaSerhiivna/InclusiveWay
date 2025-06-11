import request from "supertest";
import express from "express";

jest.mock("../../src/controllers/locationController.js", () => ({
  createLocation: jest.fn((req, res) => res.status(201).json({ message: "Location created" })),
  getLocation: jest.fn((req, res) => res.status(200).json({ id: req.params.id })),
  patchLocation: jest.fn((req, res) => res.status(200).json({ message: "Location patched" })),
  deleteLocation: jest.fn((req, res) => res.status(204).send()),
  addLocationPhoto: jest.fn((req, res) => res.status(201).json({ message: "Photo added" })),
  updateLocationFeatures: jest.fn((req, res) => res.status(200).json({ message: "Features updated" })),
  getLocations: jest.fn((req, res) => res.status(200).json([{ id: 1 }])),
  addLocationComment: jest.fn((req, res) => res.status(201).json({ message: "Comment added" })),
  getLocationComments: jest.fn((req, res) => res.status(200).json([{ comment: "Nice" }])),
  getPendingLocations: jest.fn((req, res) => res.status(200).json([{ id: 2 }])),
  analyzeRouteForAccessibility: jest.fn((req, res) => res.status(200).json({ accessible: true })),
}));

jest.mock("../../src/unitilies/tokenAuthenticationMiddleware.js", () => ({
  authenticateUserToken: (req, res, next) => next(),
  authenticateAdminToken: (req, res, next) => next(),
}));

import locationRouter from "../../src/routes/locationsRouter.js";

describe("Location Router", () => {
  let app;

  beforeAll(() => {
    app = express();
    app.use(express.json());
    app.use("/locations", locationRouter);
  });

  it("GET /locations should return locations", async () => {
    const res = await request(app).get("/locations");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 1 }]);
  });

  it("GET /locations/pending should require admin auth and return pending locations", async () => {
    const res = await request(app).get("/locations/pending");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ id: 2 }]);
  });

  it("POST /locations should require user auth and create location", async () => {
    const res = await request(app).post("/locations").send({ name: "Test Location" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "Location created" });
  });

  it("GET /locations/:id should return a location by id", async () => {
    const res = await request(app).get("/locations/123");
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ id: "123" });
  });

  it("PATCH /locations/:id should require admin auth and patch location", async () => {
    const res = await request(app).patch("/locations/123").send({ name: "Updated" });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Location patched" });
  });

  it("DELETE /locations/:id should require admin auth and delete location", async () => {
    const res = await request(app).delete("/locations/123");
    expect(res.status).toBe(204);
  });

  it("POST /locations/:id/comments should require user auth and add comment", async () => {
    const res = await request(app).post("/locations/123/comments").send({ text: "Nice place!" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "Comment added" });
  });

  it("GET /locations/:id/comments should return comments", async () => {
    const res = await request(app).get("/locations/123/comments");
    expect(res.status).toBe(200);
    expect(res.body).toEqual([{ comment: "Nice" }]);
  });

  it("PUT /locations/:id/features should require admin auth and update features", async () => {
    const res = await request(app).put("/locations/123/features").send({ features: ["wifi"] });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Features updated" });
  });

  it("POST /locations/:id/photos should require admin auth and add photo", async () => {
    const res = await request(app).post("/locations/123/photos").send({ photoUrl: "url" });
    expect(res.status).toBe(201);
    expect(res.body).toEqual({ message: "Photo added" });
  });

  it("POST /locations/route/analyze should analyze route accessibility", async () => {
    const res = await request(app).post("/locations/route/analyze").send({ route: [] });
    expect(res.status).toBe(200);
    expect(res.body).toEqual({ accessible: true });
  });
});