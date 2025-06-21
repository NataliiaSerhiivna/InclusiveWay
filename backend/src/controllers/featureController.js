// Контролер для фіч ексклюзивності

import FeatureModel from "../models/featureModel.js";

const featureModel = new FeatureModel();

export const getFeatures = async (req, res) => {
  try {
    const features = await featureModel.getFeatures();
    res.status(200).send(features);
  } catch (error) {
    es.status(500).send(error.message);
  }
};
