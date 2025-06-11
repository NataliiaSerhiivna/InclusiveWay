import { z } from "zod";
import {
  userCreateSchema,
  userLoginSchema,
  userFullSchema,
  userEditSchema,
  userReturnSchema,
} from "../../src/schemas/userSchema.js";

describe("userCreateSchema", () => {
  it("приймає валідний об'єкт", () => {
    const input = {
      username: "user123",
      email: "user@example.com",
      password: "password123",
    };
    const result = userCreateSchema.parse(input);
    expect(result.username).toBe("user123");
    expect(result.email).toBe("user@example.com");
    expect(result.password).toBe("password123");
  });

  it("відхиляє об'єкт з коротким username", () => {
    const input = {
      username: "us",
      email: "user@example.com",
      password: "password123",
    };
    expect(() => userCreateSchema.parse(input)).toThrow(z.ZodError);
  });

  it("відхиляє об'єкт з невалідним email", () => {
    const input = {
      username: "user123",
      email: "not-an-email",
      password: "password123",
    };
    expect(() => userCreateSchema.parse(input)).toThrow(z.ZodError);
  });

  it("відхиляє об'єкт з коротким password", () => {
    const input = {
      username: "user123",
      email: "user@example.com",
      password: "123",
    };
    expect(() => userCreateSchema.parse(input)).toThrow(z.ZodError);
  });

  it("відхиляє об'єкт з зайвим полем", () => {
    const input = {
      username: "user123",
      email: "user@example.com",
      password: "password123",
      extra: "field",
    };
    expect(() => userCreateSchema.parse(input)).toThrow(z.ZodError);
  });
});

describe("userLoginSchema", () => {
  it("приймає валідний логін", () => {
    const input = {
      email: "user@example.com",
      password: "password123",
    };
    const result = userLoginSchema.parse(input);
    expect(result.email).toBe("user@example.com");
  });

  it("відхиляє невалідний email", () => {
    const input = {
      email: "bad-email",
      password: "password123",
    };
    expect(() => userLoginSchema.parse(input)).toThrow(z.ZodError);
  });

  it("відхиляє короткий password", () => {
    const input = {
      email: "user@example.com",
      password: "123",
    };
    expect(() => userLoginSchema.parse(input)).toThrow(z.ZodError);
  });

  it("відхиляє зайве поле", () => {
    const input = {
      email: "user@example.com",
      password: "password123",
      extra: "field",
    };
    expect(() => userLoginSchema.parse(input)).toThrow(z.ZodError);
  });
});

describe("userFullSchema", () => {
  it("приймає валідний повний об'єкт", () => {
    const input = {
      id: 1,
      username: "user123",
      email: "user@example.com",
      password: "password123",
      role: "admin",
    };
    const result = userFullSchema.parse(input);
    expect(result.id).toBe(1);
    expect(result.role).toBe("admin");
  });

  it("відхиляє об'єкт з невідомою роллю", () => {
    const input = {
      id: 1,
      username: "user123",
      email: "user@example.com",
      password: "password123",
      role: "superuser",
    };
    expect(() => userFullSchema.parse(input)).toThrow(z.ZodError);
  });

  it("відхиляє зайве поле", () => {
    const input = {
      id: 1,
      username: "user123",
      email: "user@example.com",
      password: "password123",
      role: "user",
      extra: "field",
    };
    expect(() => userFullSchema.parse(input)).toThrow(z.ZodError);
  });
});

describe("userEditSchema", () => {
  it("приймає частковий об'єкт з username", () => {
    const input = {
      username: "newuser",
    };
    const result = userEditSchema.parse(input);
    expect(result.username).toBe("newuser");
  });

  it("приймає частковий об'єкт з email", () => {
    const input = {
      email: "new@example.com",
    };
    const result = userEditSchema.parse(input);
    expect(result.email).toBe("new@example.com");
  });

  it("відхиляє об'єкт з коротким username", () => {
    const input = {
      username: "ab",
    };
    expect(() => userEditSchema.parse(input)).toThrow(z.ZodError);
  });

  it("ігнорує додаткові поля", () => {
    const input = {
      username: "user123",
      extra: "field",
    };
    const result = userEditSchema.parse(input);
    expect(result.username).toBe("user123");
    expect(result).not.toHaveProperty("extra");
  });
});

describe("userReturnSchema", () => {
  it("приймає валідний об'єкт", () => {
    const input = {
      username: "user123",
      email: "user@example.com",
      role: "user",
    };
    const result = userReturnSchema.parse(input);
    expect(result.username).toBe("user123");
    expect(result.role).toBe("user");
  });

  it("відхиляє об'єкт з невалідним email", () => {
    const input = {
      username: "user123",
      email: "bad-email",
      role: "admin",
    };
    expect(() => userReturnSchema.parse(input)).toThrow(z.ZodError);
  });

  it("відхиляє об'єкт з невідомою роллю", () => {
    const input = {
      username: "user123",
      email: "user@example.com",
      role: "moderator",
    };
    expect(() => userReturnSchema.parse(input)).toThrow(z.ZodError);
  });
});
