import LocationModel from "../models/locationModel.js";
import LocationFeatureModel from "../models/locationFeatureModel.js";
import LocationPhotoModel from "../models/locationPhotoModel.js";
import LocationCommentModel from "../models/locationCommentModel.js";
import zod from "zod";
import fromDbToJSON from "../unitilies/locationConverter.js";
import {
  locationCreateSchema,
  locationFullSchema,
  locationUpdateSchema,
} from "../schemas/locationSchema.js";
import {
  lcoationPhotoFullSchema,
  locationPhotoCreateSchema,
} from "../schemas/locationPhotoSchema.js";

import {
  commentCreateSchema,
  commentFullSchema,
} from "../schemas/commentSchema.js";

const locationModel = new LocationModel();
const locationFeatureModel = new LocationFeatureModel();
const locationPhotoModel = new LocationPhotoModel();
const locationCommentModel = new LocationCommentModel();

export const createLocation = async (req, res) => {
  try {
    const location = locationCreateSchema.parse(req.body);

    console.log(req.userId);

    const createdLocation = await locationModel.create({
      name: location.name,
      address: location.address,
      latitude: location.latitude,
      longitude: location.longitude,
      description: location.description,
      created_by: Number(req.userId),
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

    const response = fromDbToJSON(fullLocation);

    const validatedResponse = locationFullSchema.parse(response);

    res.status(200).send(validatedResponse);
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
  }
};

export const patchLocation = async (req, res) => {
  try {
    const locationPatches = locationUpdateSchema.parse(req.body);
    const patchedLocation = await locationModel.patch(
      Number(req.params.id),
      locationPatches
    );
    res.status(200).send(patchedLocation);
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
  }
};

export const deleteLocation = async (req, res) => {
  try {
    await locationModel.delete(Number(req.params.id));
    res.status(200).send();
  } catch (error) {
    res.status(500).send(error.meassage);
  }
};

export const addLocationPhoto = async (req, res) => {
  try {
    const photo = locationPhotoCreateSchema.parse(req.body);

    const newPhoto = await locationPhotoModel.create({
      location_id: Number(req.params.id),
      image_url: photo.imageURL,
      description: photo.description,
      uploaded_at: photo.uploadedAt,
    });
    res.status(201).send(newPhoto);
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
  }
};

export const updateLocationFeatures = async (req, res) => {
  try {
    const features = req.body.features;
    locationFeatureModel.updateForLocation(Number(req.params.id), features);
    res.status(200).send();
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
  }
};

export const addLocationComment = async (req, res) => {
  try {
    const comment = commentCreateSchema.parse(req.body);
    const newComment = await locationCommentModel.create({
      location_id: Number(req.params.id),
      user_id: Number(req.userid),
      content: comment.content,
      created_at: comment.createdAt,
    });
    console.log(newComment);

    res.status(200).send(newComment);
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
  }
};
export const getLocationComments = async (req, res) => {
  try {
    const comments = await locationCommentModel.getComments(
      Number(req.params.id)
    );
    const response = {
      comments: [],
    };

    for (let i = 0; i < comments.length; i++) {
      const currentComment = comments.at(i);
      const convertedComment = {
        id: currentComment.id,
        locationId: currentComment.location_id,
        userId: currentComment.user_id,
        content: currentComment.content,
        createdAt: currentComment.created_at.toISOString(),
      };
      const validatedComment = commentFullSchema.parse(convertedComment);
      response.comments.push(validatedComment);
    }

    res.status(200).send(response);
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
  }
};
export const getLocations = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const name = req.query.name || "";
    const featureIds = req.query.features
      ? req.query.features.split(",").map(Number)
      : [];
    const filters = {
      name,
      featureIds,
      page,
      limit,
    };
    const locations = await locationModel.getLocations(filters);

    const response = {
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
      response.locations.push(validatedLocation);
    });

    res.status(200).send(response);
  } catch (error) {
    if (error instanceof zod.ZodError) res.status(400).send(error.issues);
    else res.status(500).send(error.meassage);
  }
};
