import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { userCreateSchema } from "../../src/schemas/userSchema.js";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    users: {
      create: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mPrismaClient),
  };
});

jest.mock("bcrypt", () => ({
  hash: jest.fn(),
}));

console.log = jest.fn();

import { createAdmin } from "../../src/scripts/createAdmin.js";

describe("createAdmin", () => {
  let prismaMock;

  beforeEach(() => {
    prismaMock = new PrismaClient();
    jest.clearAllMocks();
  });

  it("успішно створює адміністратора", async () => {
    const user = {
      username: "adminUser",
      email: "admin@example.com",
      password: "secret123",
    };

    bcrypt.hash.mockResolvedValue("hashedPassword123");
    prismaMock.users.create.mockResolvedValue({
      id: 1,
      username: user.username,
      email: user.email,
      role: "admin",
    });

    await createAdmin(user);

    expect(userCreateSchema.safeParse(user).success).toBe(true);
    expect(bcrypt.hash).toHaveBeenCalledWith(user.password, 10);
    expect(prismaMock.users.create).toHaveBeenCalledWith({
      data: {
        username: user.username,
        email: user.email,
        password_hash: "hashedPassword123",
        role: "admin",
      },
    });
  });

  it("викидає помилку на невалідні дані", async () => {
    const badUser = {
      username: "",
      email: "bademail",
      password: "123",
    };

    await expect(createAdmin(badUser)).rejects.toThrow();
    expect(bcrypt.hash).not.toHaveBeenCalled();
    expect(prismaMock.users.create).not.toHaveBeenCalled();
  });
});
