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
      user_id: 1,
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



//Аналіз на доступність
export async function analyzeRouteForAccessibility(req, res) {
  try {
    const { coordinates, filters } = req.body;
    console.log("📦 Route coordinates:", coordinates);

    if (!coordinates || !Array.isArray(coordinates) || coordinates.length === 0) {
      return res.status(400).json({ message: 'Маршрут невалідний' });
    }

    const requiredFeatures = new Set(filters || []);
    const routePoints = coordinates;

    const approvedLocations = await locationModel.getApprovedLocations(); 
    const warnings = [];
    const THRESHOLD = 0.0003; 

    const distance = (p1, p2) => {
      const lat1 = parseFloat(p1.lat);
      const lng1 = parseFloat(p1.lng);
      const lat2 = parseFloat(p2.lat);
      const lng2 = parseFloat(p2.lng);
      return Math.sqrt((lat1 - lat2) ** 2 + (lng1 - lng2) ** 2);
    };

    approvedLocations.forEach((loc) => {
      for (const point of routePoints) {
        const dist = distance(
          { lat: loc.latitude, lng: loc.longitude },
          point
        );

        if (dist < THRESHOLD) {
          const locFeatures = new Set(
            (loc.location_features || []).map((lf) => lf.feature.name)
          );

          if (!loc.verified) {
            warnings.push({
              lat: parseFloat(loc.latitude),
              lng: parseFloat(loc.longitude),
              type: 'unverified',
              message: `Локація "${loc.name}" не перевірена`
            });
            break;
          }

          if (locFeatures.size === 0) {
            warnings.push({
              lat: parseFloat(loc.latitude),
              lng: parseFloat(loc.longitude),
              type: 'missing_all_features',
              message: `Локація "${loc.name}" не має жодних ознак доступності`
            });
          } else {
            const missing = [...requiredFeatures].filter(f => !locFeatures.has(f));
            if (missing.length > 0) {
              warnings.push({
                lat: parseFloat(loc.latitude),
                lng: parseFloat(loc.longitude),
                type: 'missing_features',
                message: `Локація "${loc.name}" не має: ${missing.join(', ')}`
              });
            }
          }

          break;
        }
      }
    });

    return res.status(200).json({ warnings });

  } catch (error) {
    console.error('Route analysis error:', error.message);
    console.error(error.stack);
    return res.status(500).json({ message: 'Помилка аналізу маршруту', error: error.message });
  }
}