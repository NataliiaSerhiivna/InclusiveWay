import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class LocationPhotoModel {
  async create(locationPhoto) {
    await prisma.locations_photos({
      data: locationPhoto,
    });
  }
  async getById(id) {
    console.log("Gotten a location photo " + id);
  }
  async patch(id, fieldsToPatch) {}
  async delete(id) {}
  async getAll() {}
}
