import zod from "zod";
import LocationEditRequestModel from "../models/locationEditRequestModel.js";
import LocationModel from "../models/locationModel.js";
import { locationEditRequestSchema } from "../schemas/locationEditRequestSchema.js";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
const locationEditRequestModel = new LocationEditRequestModel();
const locationModel = new LocationModel();
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
export const fulfillTheRequest = async (req, res) => {
  try {
    res.status(200).send(camelcaseKeys(response, { deep: true }));
    return;
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
  }
};
