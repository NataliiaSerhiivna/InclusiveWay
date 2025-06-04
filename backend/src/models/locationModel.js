import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class LocationModel {
  async create(location) {
    const newLocation = await prisma.locations.create({
      data: location,
    });
    return newLocation;
  }
  async getById(id) {
    console.log("Gotten location " + id);
  }
  async patch(id, fieldsToPatch) {}
  async delete(id) {}
  async getAll() {}
}
