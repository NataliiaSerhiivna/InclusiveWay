import {
  createLocation,
  getLocation,
  patchLocation,
  deleteLocation,
  addLocationPhoto,
  updateLocationFeatures,
  addLocationComment,
  getLocationComments,
  getLocations,
  getPendingLocations,
  analyzeRouteForAccessibility,
} from "../../src/controllers/locationController.js";

import locationModel from "../../src/models/locationModel.js"; 
import LocationModel from "../../src/models/locationModel.js";
import LocationFeatureModel from "../../src/models/locationFeatureModel.js";
import LocationPhotoModel from "../../src/models/locationPhotoModel.js";
import LocationCommentModel from "../../src/models/locationCommentModel.js";
import locationPhotoModel from "../../src/models/locationPhotoModel.js";


import * as locationSchema from "../../src/schemas/locationSchema.js";
import * as locationPhotoSchema from "../../src/schemas/locationPhotoSchema.js";
import * as commentSchema from "../../src/schemas/commentSchema.js";

import fromDbToJSON from "../../src/unitilies/locationConverter.js";
import locationsRetriever from "../../src/unitilies/locationsRetriever.js";

import { z } from "zod";

jest.mock("../../src/models/locationModel.js");
jest.mock("../../src/models/locationFeatureModel.js");
jest.mock("../../src/models/locationPhotoModel.js");
jest.mock("../../src/models/locationCommentModel.js");
jest.mock("../../src/unitilies/locationConverter.js");
jest.mock("../../src/unitilies/locationsRetriever.js");

describe("createLocation", () => {
  let req, res;

  beforeEach(() => {
    req = {
      body: {
        name: "Тестова локація",
        address: "вул. Тестова, 1",
        latitude: 50.45,
        longitude: 30.52,
        description: "Опиc локації",
        approved: true,
        verified: true,
        createdAt: new Date().toISOString(),
        features: [1, 2],
        photos: [
          {
            imageURL: "http://example.com/photo.jpg",
            description: "Опис для фото",
            uploadedAt: new Date().toISOString(),
          },
        ],
      },
      userId: 5,
    };

    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };

    jest.spyOn(LocationModel.prototype, "create").mockResolvedValue({ id: 1 });
    jest.spyOn(LocationFeatureModel.prototype, "create").mockResolvedValue({});
    jest.spyOn(LocationPhotoModel.prototype, "create").mockResolvedValue({});
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it("створює локацію з ознаками та фото", async () => {
    await createLocation(req, res);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.send).toHaveBeenCalledWith("Location added successfully");
  });
});
