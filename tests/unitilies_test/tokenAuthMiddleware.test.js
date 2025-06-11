import { authenticateUserToken, authenticateAdminToken } from "../../src/unitilies/tokenAuthenticationMiddleware.js";
import UserserModel from "../../src/models/userModel.js";
import jwt from "jsonwebtoken";

jest.mock("../../src/models/userModel.js");
jest.mock("jsonwebtoken");

describe("Auth middlewares", () => {
  let userModelMock;
  let req, res, next;

  beforeEach(() => {
    userModelMock = {
      read: jest.fn(),
    };
    UserserModel.mockImplementation(() => userModelMock);

    req = {
      cookies: {},
    };
    res = {
      status: jest.fn().mockReturnThis(),
      send: jest.fn(),
    };
    next = jest.fn();

    process.env.JWT_SECRET = "testsecret";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("authenticateUserToken", () => {
    it("повертає 401, якщо токена немає", async () => {
      req.cookies.token = undefined;

      await authenticateUserToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({ message: "No access token provided" });
      expect(next).not.toHaveBeenCalled();
    });

    it("перевіряє токен і пропускає користувача з роллю user", async () => {
      req.cookies.token = "validtoken";
      jwt.verify.mockReturnValue({ id: "123", email: "user@example.com" });
      userModelMock.read.mockResolvedValue({ role: "user" });

      await authenticateUserToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith("validtoken", "testsecret");
      expect(userModelMock.read).toHaveBeenCalledWith("user@example.com");
      expect(req.userId).toBe("123");
      expect(req.userEmail).toBe("user@example.com");
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("повертає 403, якщо роль не user", async () => {
      req.cookies.token = "validtoken";
      jwt.verify.mockReturnValue({ id: "123", email: "user@example.com" });
      userModelMock.read.mockResolvedValue({ role: "admin" });

      await authenticateUserToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({ mesage: "Invalid token" });
      expect(next).not.toHaveBeenCalled();
    });

    it("повертає 500 при помилці в jwt.verify", async () => {
      req.cookies.token = "badtoken";
      jwt.verify.mockImplementation(() => {
        throw new Error("jwt error");
      });

      await authenticateUserToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });

  describe("authenticateAdminToken", () => {
    it("повертає 401, якщо токена немає", async () => {
      req.cookies.token = undefined;

      await authenticateAdminToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith({ message: "No access token provided" });
      expect(next).not.toHaveBeenCalled();
    });

    it("перевіряє токен і пропускає користувача з роллю admin", async () => {
      req.cookies.token = "validtoken";
      jwt.verify.mockReturnValue({ id: "admin123", email: "admin@example.com" });
      userModelMock.read.mockResolvedValue({ role: "admin" });

      await authenticateAdminToken(req, res, next);

      expect(jwt.verify).toHaveBeenCalledWith("validtoken", "testsecret");
      expect(userModelMock.read).toHaveBeenCalledWith("admin@example.com");
      expect(req.userId).toBe("admin123");
      expect(next).toHaveBeenCalled();
      expect(res.status).not.toHaveBeenCalled();
    });

    it("повертає 403, якщо роль не admin", async () => {
      req.cookies.token = "validtoken";
      jwt.verify.mockReturnValue({ id: "123", email: "user@example.com" });
      userModelMock.read.mockResolvedValue({ role: "user" });

      await authenticateAdminToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(403);
      expect(res.send).toHaveBeenCalledWith({ mesage: "Invalid token" });
      expect(next).not.toHaveBeenCalled();
    });

    it("повертає 500 при помилці в jwt.verify", async () => {
      req.cookies.token = "badtoken";
      jwt.verify.mockImplementation(() => {
        throw new Error("jwt error");
      });

      await authenticateAdminToken(req, res, next);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalled();
      expect(next).not.toHaveBeenCalled();
    });
  });
});
