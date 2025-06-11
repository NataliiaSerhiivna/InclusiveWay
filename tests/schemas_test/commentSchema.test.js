import { z } from "zod";
import {
  commentCreateSchema,
  commentEditSchema,
  commentFullSchema,
} from "../../src/schemas/commentSchema.js";

describe("commentCreateSchema", () => {
    it("приймає валідний об'єкт і трансформує createdAt у Date", () => {
        const input = {
          content: "Це тестовий коментар",
          createdAt: "2023-06-11T10:00:00Z",
        };
      
        const result = commentCreateSchema.parse(input);
      
        expect(result.content).toBe(input.content);
        expect(result.createdAt).toBeInstanceOf(Date);
        expect(result.createdAt.getTime()).toBe(new Date(input.createdAt).getTime());
      });      

  it("відхиляє об'єкт без content", () => {
    const input = {
      createdAt: "2023-06-11T10:00:00Z",
    };

    expect(() => commentCreateSchema.parse(input)).toThrow(z.ZodError);
  });

  it("відхиляє об'єкт з некоректним createdAt", () => {
    const input = {
      content: "Коментар",
      createdAt: "не дата",
    };

    expect(() => commentCreateSchema.parse(input)).toThrow(z.ZodError);
  });
});

describe("commentEditSchema", () => {
  it("дозволяє частковий об'єкт з будь-якими полями", () => {
    const inputs = [
      {},
      { content: "Редагований текст" },
      { createdAt: "2023-06-11T10:00:00Z" },
      { content: "Редагування", createdAt: "2023-06-11T10:00:00Z" },
    ];

    inputs.forEach((input) => {
      const result = commentEditSchema.parse(input);
      if (input.createdAt) {
        expect(result.createdAt).toBeInstanceOf(Date);
      }
    });
  });

  it("відхиляє некоректні поля", () => {
    const input = { content: 123, createdAt: 456 };
    expect(() => commentEditSchema.parse(input)).toThrow(z.ZodError);
  });
});

describe("commentFullSchema", () => {
  it("приймає повний валідний об'єкт", () => {
    const input = {
      id: 1,
      locationId: 2,
      userId: 3,
      content: "Повний коментар",
      createdAt: "2023-06-11T10:00:00Z",
    };

    const result = commentFullSchema.parse(input);

    expect(result.id).toBe(1);
    expect(result.locationId).toBe(2);
    expect(result.userId).toBe(3);
    expect(result.content).toBe("Повний коментар");
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it("відхиляє об'єкт без обов'язкових полів", () => {
    const input = {
      content: "Коментар",
      createdAt: "2023-06-11T10:00:00Z",
      id: 1,
    };

    expect(() => commentFullSchema.parse(input)).toThrow(z.ZodError);
  });
});
