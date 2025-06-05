import LocationModel from "../models/locationModel.js";
import LocationFeatureModel from "../models/locationFeatureModel.js";
import LocationPhotoModel from "../models/locationPhotoModel.js";
import zod from "zod";
import {
  locationCreateSchema,
  locationFullSchema,
  locationUpdateSchema,
} from "../schemas/locationSchema.js";
import { lcoationPhotoFullSchema } from "../schemas/locationPhotoSchema.js";

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
      created_by: location.createdBy,
      approved: location.approved,
      verified: location.authenticated,
      created_at: location.createdAt,
    });

    location.features.forEach(async (feature) => {
      await locationFeatureModel.create({
        location_id: createdLocation.id,
        feature_id: feature,
      });
    });

    location.photos.forEach(async (photo) => {
      await locationPhotoModel.create({
        location_id: createdLocation.id,
        image_url: photo.imageURL,
        description: photo.description,
        uploaded_at: photo.uploadedAt,
      });
    });

    res.status(201).send("Location added successfully");
  } catch (error) {
    if (error instanceof zod.ZodError) {
      res.status(400).send(error.issues);
    } else {
      res.status(501).send(error.message);
    }
  }
};

export const getLocation = async (req, res) => {
  try {
    const location = await locationModel.getById(Number(req.params.id));
    const features = location.location_features.map((lf) => lf.feature);

    const fullLocation = {
      ...location,
      features,
    };

    const response = {
      id: fullLocation.id,
      name: fullLocation.name,
      address: fullLocation.address,
      latitude: fullLocation.latitude.toNumber(),
      longitude: fullLocation.longitude.toNumber(),
      description: fullLocation.description,
      createdBy: fullLocation.created_by,
      approved: fullLocation.approved,
      verified: fullLocation.verified,
      createdAt: fullLocation.created_at.toISOString(),
      features: fullLocation.features.map(
        (lf) =>
          (lf = {
            id: lf.id,
            name: lf.name,
            description: ld.description,
          })
      ),
      photos: fullLocation.location_photos.map(
        (lf) =>
          (lf = {
            id: lf.id,
            locationId: lf.location_id,
            imageURL: lf.image_url,
            description: lf.description,
            uploadedAt: lf.uploaded_at.toISOString(),
          })
      ),
      comments: fullLocation.comments.map(
        (lc) =>
          (lc = {
            id: lc.id,
            locationId: lc.location_id,
            userId: lc.user_id,
            content: lc.content,
            createdAt: lc.created_at.toISOString(),
          })
      ),
    };

    const validatedResponse = locationFullSchema.parse(response);

    res.status(202).send(validatedResponse);
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
