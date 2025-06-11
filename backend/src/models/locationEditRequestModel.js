import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export default class LocationEditRequestModel {
  async create(request) {
    const result = await prisma.location_edit_requests.create({
      data: request,
    });
    return result;
  }
  async read(id) {
    const result = await prisma.location_edit_requests.findUnique({
      where: {
        id: id,
      },
    });
    return result;
  }
  async delete(id) {
    await prisma.location_edit_requests.delete({
      where: {
        id: id,
      },
    });
  }
  async readMany({ searchString = "", page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const requests = await prisma.location_edit_requests.findMany({
      where: {
        location: {
          OR: [
            { name: { contains: searchString, mode: "insensitive" } },
            { address: { contains: searchString, mode: "insensitive" } },
          ],
        },
      },
      include: {
        location: {
          select: {
            name: true,
            address: true,
          },
        },
      },
      skip: skip,
      take: limit,
    });
    return requests;
  }
}
