import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class LocationPhotoModel {
  async create(locationPhoto) {
    await prisma.locations_photos.create({
      data: locationPhoto,
    });
  }
  async getById(id) {
    console.log("Gotten a location photo " + id);
  }
  async delete(photoId) {
    await prisma.locations_photos.delete({
      where: {
        id: photoId,
      },
    });
  }
  async getAll() {}
}
