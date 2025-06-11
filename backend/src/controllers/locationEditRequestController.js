import zod from "zod";
import LocationEditRequestModel from "../models/locationEditRequestModel.js";
import LocationModel from "../models/locationModel.js";
import LocationFeatureModel from "../models/locationFeatureModel.js";
import LocationPhotoModel from "../models/locationPhotoModel.js";
import fromDbToJSON from "../unitilies/locationConverter.js";
import {
  locationEditRequestArrayFullSchema,
  locationEditRequestSchema,
  locationEditRequestRetrieveSchema,
  payloadEditSchema,
} from "../schemas/locationEditRequestSchema.js";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
import {
  locationFullSchema,
  locationUpdateSchema,
} from "../schemas/locationSchema.js";
import { locationPhotoCreateSchema } from "../schemas/locationPhotoSchema.js";
import payloadIntoLocation from "../unitilies/payloadIntoLocation.js";
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
    if (!changes) {
      res.status(500).send();
      return;
    }
    //console.log(changes);

    const validatedChanges = locationEditRequestRetrieveSchema.parse(
      camelcaseKeys(changes, { deep: true })
    );
    console.log(validatedChanges);

    const currentLocation = await locationModel.getById(changes.location_id);
    const newLocation = payloadIntoLocation(
      validatedChanges.payload,
      currentLocation
    );

    const response = {
      validatedChanges,
      currentLocation,
      newLocation,
    };
    console.log(response);

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
export const fulfillTheRequest = async (req, res) => {
  try {
    const validatedRequest = locationEditRequestRetrieveSchema.parse(req.body);

    const validatedPayload = validatedRequest.payload;
    const changesToLocation = snakecaseKeys(
      locationUpdateSchema.parse(validatedPayload),
      { deep: true }
    );

    if (validatedPayload.photosToAdd) {
      const photosToAdd = snakecaseKeys(validatedPayload.photosToAdd, {
        deep: true,
      });
      const photosForPrisma = photosToAdd.map((photo) => ({
        ...photo,
        location_id: validatedRequest.locationId,
      }));
      await locationPhotoModel.createMany(photosForPrisma);
    }

    const features = validatedPayload.features || [];

    const photosToDelete = validatedPayload.photosToDelete || [];

    const changedLocation = await locationModel.patch(
      validatedRequest.locationId,
      changesToLocation
    );
    console.log("here");

    await locationFeatureModel.updateForLocation(
      validatedRequest.locationId,
      features
    );

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

//To be done
export const getAllLocationEditRequests = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const searchString = req.query.searchString || "";
    const filters = {
      searchString,
      page,
      limit,
    };

    const requests = await locationEditRequestModel.readMany(filters);
    const formattedRequests = camelcaseKeys(requests, { deep: true });
    console.log(formattedRequests);

    const validatedRequests =
      locationEditRequestArrayFullSchema.parse(formattedRequests);

    res.status(200).send(validatedRequests);
    return;
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
    return;
  }
};
