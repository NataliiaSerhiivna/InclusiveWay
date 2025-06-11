import zod from "zod";
import LocationEditRequestModel from "../models/locationEditRequestModel.js";
import LocationModel from "../models/locationModel.js";
import LocationFeatureModel from "../models/locationFeatureModel.js";
import LocationPhotoModel from "../models/locationPhotoModel.js";
import {
  locationEditRequestSchema,
  payloadEditSchema,
} from "../schemas/locationEditRequestSchema.js";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import { locationUpdateSchema } from "../schemas/locationSchema.js";
import { locationPhotoCreateSchema } from "../schemas/locationPhotoSchema.js";
const locationEditRequestModel = new LocationEditRequestModel();
const locationModel = new LocationModel();
const locationFeatureModel = new LocationFeatureModel();
const locationPhotoModel = new LocationPhotoModel();

export const addLocationEditRequest = async (req, res) => {
  try {
    const data = locationEditRequestSchema.parse(req.body);

    if (Object.keys(data.payload).length === 0) {
      res.status(400).send({ message: "Payload must not be empty" });
    }

    data.requestedBy = Number(req.userId);

    const convertedData = snakecaseKeys(data, { deep: true });

    const newEntry = await locationEditRequestModel.create(convertedData);

    res.status(201).send(camelcaseKeys(newEntry, { deep: true }));
    return;
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
  }
};

export const getLocationEditRequest = async (req, res) => {
  try {
    const changes = await locationEditRequestModel.read(Number(req.params.id));
    const currentLocation = await locationModel.getById(changes.location_id);

    const response = {
      changes,
      currentLocation,
    };
    res.status(200).send(camelcaseKeys(response, { deep: true }));
    return;
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
    return;
  }
};
export const deleteLocationEditRequest = async (req, res) => {
  try {
    await locationEditRequestModel.delete(Number(req.params.id));
    res.status(200).send();
    return;
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
    return;
  }
};

//To be done
export const getAllLocationEditRequests = async (req, res) => {
  try {
    const changes = await locationEditRequestModel.read(Number(req.params.id));
    const currentLocation = await locationEditRequestModel.read(
      changes.location_id
    );

    const response = {
      changes,
      currentLocation,
    };
    res.status(200).send(
      camelcaseKeys(response, {
        deep: true,
      })
    );
    return;
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
    return;
  }
};

export const fulfillTheRequest = async (req, res) => {
  try {
    const validatedRequest = locationEditRequestSchema.parse(req.body);

    const validatedPayload = validatedRequest.payload;
    const changesToLocation = snakecaseKeys(
      locationUpdateSchema.parse(validatedPayload),
      { deep: true }
    );

    const features = validatedPayload.features;
    const photosToAdd = snakecaseKeys(validatedPayload.photosToAdd, {
      deep: true,
    });
    const photosForPrisma = photosToAdd.map((photo) => ({
      ...photo,
      location_id: validatedRequest.locationId,
    }));
    const photosToDelete = validatedPayload.photosToDelete;

    const changedLocation = await locationModel.patch(
      validatedRequest.locationId,
      changesToLocation
    );
    await locationFeatureModel.updateForLocation(
      validatedRequest.locationId,
      features
    );
    await locationPhotoModel.createMany(photosForPrisma);

    await locationPhotoModel.deleteMany(photosToDelete);

    await locationEditRequestModel.delete(Number(req.params.id));

    res.status(200).send();
    return;
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
    return;
  }
};
