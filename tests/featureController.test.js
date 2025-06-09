import { getFeatures } from "../src/controllers/featureController.js";
import FeatureModel from "../src/models/featureModel.js";

jest.mock("../src/models/featureModel.js");

const mockGetFeatures = jest.fn();


FeatureModel.mockImplementation(() => ({
  getFeatures: mockGetFeatures,
}));

describe("featureController.getFeatures", () => {
  let req, res;

  beforeEach(() => {
    req = {}; 
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    mockGetFeatures.mockReset();
  });

  it("повертає список фіч з кодом 200", async () => {
    const mockFeatures = [{ id: 1, name: "Accessible Entrance" }];
    mockGetFeatures.mockResolvedValue(mockFeatures);

    await getFeatures(req, res);

    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(mockFeatures);
  });

  it("повертає помилку з кодом 500", async () => {
    const error = new Error("DB error");
    mockGetFeatures.mockRejectedValue(error);

    await getFeatures(req, res);

    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.send).toHaveBeenCalledWith("DB error");
  });
});
