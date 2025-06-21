// Функція для отримання списку локації з бд

import LocationModel from "../models/locationModel.js";
import { locationFullSchema } from "../schemas/locationSchema.js";
import fromDbToJSON from "./locationConverter.js";
const locationModel = new LocationModel();

export default async function locationsRetriever(req) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const searchString = req.query.searchString || "";
  const featureIds = req.query.features
    ? req.query.features.split(",").map(Number)
    : [];
  const filters = {
    searchString,
    featureIds,
    page,
    limit,
  };

  const locations = await locationModel.getLocations(filters);
  const result = {
    locations: [],
  };

  locations.forEach((location) => {
    const features = location.location_features.map((lf) => lf.feature);
    const fullLocation = {
      ...location,
      features,
    };
    const validatedLocation = locationFullSchema.parse(
      fromDbToJSON(fullLocation)
    );
    result.locations.push(validatedLocation);
  });
  return result;
}
