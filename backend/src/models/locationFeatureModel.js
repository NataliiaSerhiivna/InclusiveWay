import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class LocationFeatureModel {
  async create(locationFeature) {
    await prisma.locations_features.create({ data: locationFeature });
    console.log("Added a lcoatin-feature pair ");
  }
  async getById(id) {
    console.log("Gotten location-feature pair " + id);
  }
  async patch(fieldsToPatch) {}
  async delete(id) {}
  async getAll() {}
}
