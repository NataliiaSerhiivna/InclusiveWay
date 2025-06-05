import { PrismaClient } from "@prisma/client";
import { camelToSnakeCase } from "../unitilies/camelSnakeModifications.js";
const prisma = new PrismaClient();

export default class LocationModel {
  async create(location) {
    const newLocation = await prisma.locations.create({
      data: location,
    });
    return newLocation;
  }
  async getById(locationId) {
    console.log(locationId);

    const location = await prisma.locations.findUnique({
      where: { id: locationId },
      include: {
        location_photos: true,
        comments: true,
        location_features: {
          include: {
            feature: true,
          },
        },
      },
    });
    return location;
  }
  async patch(locationId, fieldsToPatch) {
    fieldsToPatch = camelToSnakeCase(fieldsToPatch);
    console.log(fieldsToPatch);
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
  async getLocations({ name = "", featureIds = [], page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const locations = await prisma.locations.findMany({
      where: {
        ...(name && {
          name: {
            contains: name,
            mode: "insensitive",
          },
        }),
        ...(featureIds.length > 0 && {
          location_features: {
            some: {
              feature_id: { in: featureIds },
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
        comments: true,
      },
      skip,
      take: limit,
    });

    return locations;
  }
}
