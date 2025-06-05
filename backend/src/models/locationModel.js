import { PrismaClient } from "@prisma/client";

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
        comments: true,
        location_features: {
          include: {
            feature: true, // This gets the actual feature details
          },
        },
      },
    });
    return location;
  }
  async patch(id, fieldsToPatch) {}
  async delete(id) {}
  async getAll() {}
}
