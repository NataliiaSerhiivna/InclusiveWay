import { PrismaClient } from "@prisma/client";
import { camelToSnakeCase } from "../unitilies/camelSnakeModifications.js";
const prisma = new PrismaClient();

export default class UserModel {
  async create(user) {
    const newUser = await prisma.users.create({
      data: user,
    });
    return newUser;
  }
  async read(userEmail) {
    const user = await prisma.users.findUnique({
      where: {
        email: userEmail,
      },
    });
    return user;
  }
  async patch(id, fieldsToPatch) {
    fieldsToPatch = camelToSnakeCase(fieldsToPatch);
    const patchedUser = await prisma.users.update({
      where: {
        id: id,
      },
      data: {
        ...fieldsToPatch,
      },
    });
    return patchedUser;
  }
  async delete(id) {}
  async getAll({ name = "", page = 1, limit = 10 }) {
    const skip = (page - 1) * limit;
    const users = await prisma.users.findMany({
      where: {
        ...(name && {
          name: {
            contains: name,
            mode: "insensitive",
          },
        }),
      },
      skip,
      take: limit,
    });
    return users;
  }
}
