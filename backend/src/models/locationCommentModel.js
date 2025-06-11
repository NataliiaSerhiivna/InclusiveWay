import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
export default class LocationCommentModel {
  async create(comment) {
    const newComment = await prisma.comments.create({
      data: comment,
    });

    return newComment;
  }
  async delete(id) {
    await prisma.comments.delete({
      where: {
        id: id,
      },
    });
  }
  async getComments(locationId) {
    return await prisma.comments.findMany({
      where: {
        location_id: locationId,
      },
    });
  }
}
