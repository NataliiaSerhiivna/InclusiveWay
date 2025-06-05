import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default class UserModel {
  async create(user) {
    const newUser = await prisma.users.create({
      data: user,
    });
    return newUser;
  }
  async getById(id) {
    console.log("Gotten location " + id);
  }
  async patch(id, fieldsToPatch) {}
  async delete(id) {}
  async getAll() {}
}
