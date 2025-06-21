// Контролер для видалення фотографій

import LocationPhotoModel from "../models/locationPhotoModel.js";
const locationPhotoModel = new LocationPhotoModel();

export const deleteLocationPhoto = async (req, res) => {
  try {
    await locationPhotoModel.delete(Number(req.params.id));
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error.message);
  }
};
