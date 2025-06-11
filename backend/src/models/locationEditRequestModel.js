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
}
