import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default class FeatureModel {
  async getFeatures() {
    const features = await prisma.features.findMany();
    return features;
  }
}
