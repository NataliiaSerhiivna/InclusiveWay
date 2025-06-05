import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class LocationFeatureModel {
  async create(locationFeature) {
    await prisma.locations_features.create({ data: locationFeature });
    console.log("Added a lcoatin-feature pair ");
  }

  async updateForLocation(locationId, features) {
    await prisma.locations_features.deleteMany({
      where: {
        location_id: locationId,
        feature_id: {
          notIn: features,
        },
      },
    });
    features.forEach(async (feature) => {
      await prisma.locations_features.upsert({
        where: {
          location_id_feature_id: {
            location_id: locationId,
            feature_id: feature,
          },
        },
        update: {},
        create: {
          location_id: locationId,
          feature_id: feature,
        },
      });
    });
  }
  async delete(id) {}
  async getAll() {}
}
