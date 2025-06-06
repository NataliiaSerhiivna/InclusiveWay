import { PrismaClient } from "@prisma/client";

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
  async patch(id, fieldsToPatch) {}
  async delete(id) {}
  async getAll() {}
}
