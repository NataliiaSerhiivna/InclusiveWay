import { createUser, authenticateUser } from "../src/controllers/userController.js";
import UserModel from "../src/models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

jest.mock("../src/models/userModel.js");
jest.mock("bcrypt");
jest.mock("jsonwebtoken");

describe("userController", () => {
  let req, res, mockCreate, mockRead;

  beforeEach(() => {
    req = {
      body: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
      cookie: jest.fn(),
    };

    mockCreate = jest.fn();
    mockRead = jest.fn();

    // Повна підміна конструктора UserModel
    UserModel.mockImplementation(() => ({
      create: mockCreate,
      read: mockRead,
    }));
  });

  describe("createUser", () => {
    it("створює користувача та повертає 204", async () => {
      req.body = {
        username: "user1",
        email: "user1@example.com",
        password: "password123",
      };
      bcrypt.hash.mockResolvedValue("hashedPass");

      await createUser(req, res);

      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 10);
      expect(mockCreate).toHaveBeenCalledWith({
        name: "user1",
        email: "user1@example.com",
        password_hash: "hashedPass",
      });
      expect(res.status).toHaveBeenCalledWith(204);
      expect(res.send).toHaveBeenCalled();
    });

    it("повертає 400 при невалідних даних", async () => {
      req.body = {}; // невалідний

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });

    it("повертає 500 при помилці бази", async () => {
      req.body = {
        username: "user1",
        email: "user1@example.com",
        password: "password123",
      };
      bcrypt.hash.mockResolvedValue("hashedPass");
      mockCreate.mockRejectedValue(new Error("DB error"));

      await createUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("DB error");
    });
  });

  describe("authenticateUser", () => {
    it("успішно автентифікує користувача", async () => {
      req.body = {
        email: "user1@example.com",
        password: "password123",
      };

      mockRead.mockResolvedValue({
        id: 1,
        email: "user1@example.com",
        password_hash: "hashedPass",
        role: "user",
      });

      bcrypt.compare.mockResolvedValue(true);
      jwt.sign.mockReturnValue("mock-token");

      await authenticateUser(req, res);

      expect(mockRead).toHaveBeenCalledWith("user1@example.com");
      expect(bcrypt.compare).toHaveBeenCalledWith("password123", "hashedPass");
      expect(jwt.sign).toHaveBeenCalled();
      expect(res.cookie).toHaveBeenCalledWith("token", "mock-token", expect.any(Object));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith({
        email: "user1@example.com",
      });
    });

    it("повертає 401 при неправильному паролі", async () => {
      req.body = {
        email: "user1@example.com",
        password: "wrongpassword",
      };

      mockRead.mockResolvedValue({
        id: 1,
        email: "user1@example.com",
        password_hash: "hashedPass",
        role: "user",
      });

      bcrypt.compare.mockResolvedValue(false);

      await authenticateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Invalid credentials");
    });

    it("повертає 400 при помилці валідації", async () => {
      req.body = {}; // порожнє

      await authenticateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalled();
    });

    it("повертає 500 при винятку", async () => {
      req.body = {
        email: "user1@example.com",
        password: "password123",
      };
      mockRead.mockRejectedValue(new Error("Something broke"));

      await authenticateUser(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Something broke");
    });
  });
});
