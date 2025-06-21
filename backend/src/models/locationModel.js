// Модель для роботи з локаціями в базі даних

import { PrismaClient } from "@prisma/client";
import { camelToSnakeCase } from "../unitilies/camelSnakeModifications.js";
import { locationFullSchema } from "../schemas/locationSchema.js";
import fromDbToJSON from "../unitilies/locationConverter.js";
const prisma = new PrismaClient();

export default class LocationModel {
  async create(location) {
    const newLocation = await prisma.locations.create({
      data: location,
    });
    return newLocation;
  }
  async getById(locationId) {
    const location = await prisma.locations.findUnique({
      where: { id: locationId },
      include: {
        location_photos: true,
        comments: {
          include: {
            users: {
              select: {
                username: true,
              },
            },
          },
        },
        location_features: {
          include: {
            feature: true,
          },
        },
      },
    });
    const features = location.location_features.map((lf) => lf.feature);
    const fullLocation = {
      ...location,
      features,
    };

    const convertedLocation = fromDbToJSON(fullLocation);

    const validatedLocation = locationFullSchema.parse(convertedLocation);

    return validatedLocation;
  }
  async patch(locationId, fieldsToPatch) {
    fieldsToPatch = camelToSnakeCase(fieldsToPatch);
    const patchedLocation = await prisma.locations.update({
      where: {
        id: locationId,
      },
      data: {
        ...fieldsToPatch,
      },
    });
    return patchedLocation;
  }

  async delete(locationId) {
    await prisma.locations.delete({
      where: {
        id: locationId,
      },
    });
  }
  async getLocations({
    searchString = "",
    featureIds = [],
    page = 1,
    limit = 10,
  }) {
    const skip = (page - 1) * limit;
    const locations = await prisma.locations.findMany({
      where: {
        ...(searchString && {
          OR: [
            {
              name: {
                contains: searchString,
                mode: "insensitive",
              },
            },
            {
              address: {
                contains: searchString,
                mode: "insensitive",
              },
            },
          ],
        }),
        ...(featureIds.length > 0 && {
          location_features: {
            some: {
              feature_id: {
                in: featureIds,
              },
            },
          },
        }),
      },
      include: {
        location_features: {
          include: {
            feature: true,
          },
        },
        location_photos: true,
        comments: {
          include: {
            users: {
              select: {
                username: true,
              },
            },
          },
        },
      },
      skip,
      take: limit,
    });

    return locations;
  }

  async getApprovedLocations() {
    const result = await prisma.locations.findMany({
      where: { approved: true },
      include: {
        location_features: {
          include: {
            feature: true,
          },
        },
      },
    });
    return result;
  }
}
