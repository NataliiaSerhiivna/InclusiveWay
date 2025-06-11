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
  async deleteMany(photoIds) {
    await prisma.locations_photos.deleteMany({
      where: {
        id: {
          in: photoIds,
        },
      },
    });
  }
  async createMany(photos) {
    const newPhotos = await prisma.locations_photos.createMany({
      data: photos,
    });
    console.log(newPhotos);
  }
}
