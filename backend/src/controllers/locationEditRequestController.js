import zod from "zod";
import LocationEditRequestModel from "../models/locationEditRequestModel.js";
import { locationEditRequestSchema } from "../schemas/locationEditRequestSchema.js";
import snakecaseKeys from "snakecase-keys";
import camelcaseKeys from "camelcase-keys";
const locationEditRequestModel = new LocationEditRequestModel();
export const addLocationEditRequest = async (req, res) => {
  try {
    const data = locationEditRequestSchema.parse(req.body);
    data.requestedBy = Number(req.userId);

    const convertedData = snakecaseKeys(data, { deep: true });
    console.log(convertedData);

    const newEntry = await locationEditRequestModel.create(convertedData);

    res.status(201).send(camelcaseKeys(newEntry, { deep: true }));
    return;
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
  }
};
