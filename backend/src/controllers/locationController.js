import LocationModel from "../models/locationModel.js";
import LocationFeatureModel from "../models/locationFeatureModel.js";
import LocationPhotoModel from "../models/locationPhotoModel.js";
import zod from "zod";
import {
  locationCreateSchema,
  locationFullSchema,
  locationUpdateSchema,
} from "../schemas/locationSchema.js";

const locationModel = new LocationModel();
const locationFeatureModel = new LocationFeatureModel();
const locationPhotoModel = new LocationPhotoModel();

export const createLocation = async (req, res) => {
  try {
    const location = locationCreateSchema.parse(req.body);

    console.log(location);

    const createdLocation = await locationModel.create({
      name: location.name,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      description: location.description,
      createdBy: location.createdBy,
      approved: location.approved,
      verified: location.authenticated,
      createdAt: location.createdAt,
    });

    location.features.forEach(async (feature) => {
      await locationFeatureModel.create({
        locationId: createdLocation.id,
        featureId: feature,
      });
    });

    location.photos.forEach(async (photo) => {
      await locationPhotoModel.create({
        locationId: createdLocation.id,
        imageURL: photo.imageURL,
        description: photo.description,
        uploadedAt: photo.uploadedAt,
      });
    });

    res.status(201).send("Location added successfully");
  } catch (error) {
    if (error instanceof zod.ZodError) {
      res.status(400).send(error.issues);
    } else {
      res.status(500).send(error.message);
    }
  }
};

export const getLocation = async (req, res) => {
  try {
    const location = await locationModel.getById(req.params.id);
    const validatedLocation = locationFullSchema.parse(location);
    res.status(201).send(validatedLocation);
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
  }
};

export const patchLocation = async (req, res) => {
  try {
    const locationPatches = locationUpdateSchema.parse(req.params.id, req.body);
    await locationModel.patch(locationPatches);
    res.status(204);
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
  }
};

export const deleteLocation = async (req, res) => {
  try {
    await locationModel.delete(req.params.id);
  } catch (error) {
    res.status(500).send(error.meassage);
  }
};

export const updateLocationPhotos = async (req, res) => {
  try {
    //add new entries to photos table and delete old entries
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
  }
};

export const updateLocationFeatures = async (req, res) => {
  try {
    //add new entries to location-feature table, and delete old ones
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
  }
};

export const getLocations = async (req, res) => {
  try {
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
  }
};
