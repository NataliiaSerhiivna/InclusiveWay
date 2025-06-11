import { z } from "zod";
import { featureCreateSchema, featureFullSchema } from "../../src/schemas/featureSchema.js";

describe("featureCreateSchema", () => {
  it("приймає валідний об'єкт з name і description", () => {
    const input = {
      name: "Feature 1",
      description: "Опис функції",
    };
    const result = featureCreateSchema.parse(input);
    expect(result.name).toBe(input.name);
    expect(result.description).toBe(input.description);
  });

  it("приймає валідний об'єкт з name і null description", () => {
    const input = {
      name: "Feature 2",
      description: null,
    };
    const result = featureCreateSchema.parse(input);
    expect(result.name).toBe(input.name);
    expect(result.description).toBeNull();
  });

  it("відхиляє об'єкт з порожнім name", () => {
    const input = {
      name: "",
      description: "Опис",
    };
    expect(() => featureCreateSchema.parse(input)).toThrow(z.ZodError);
  });

  it("відхиляє об'єкт без name", () => {
    const input = {
      description: "Опис",
    };
    expect(() => featureCreateSchema.parse(input)).toThrow(z.ZodError);
  });

  it("дозволяє description бути відсутнім (undefined)", () => {
    const input = {
      name: "Feature без опису",
    };
    expect(() => featureCreateSchema.parse(input)).toThrow(z.ZodError);
  });
});

describe("featureFullSchema", () => {
  it("приймає валідний повний об'єкт", () => {
    const input = {
      id: 1,
      name: "Feature 1",
      description: "Опис функції",
    };
    const result = featureFullSchema.parse(input);
    expect(result.id).toBe(1);
    expect(result.name).toBe(input.name);
    expect(result.description).toBe(input.description);
  });

  it("відхиляє об'єкт без id", () => {
    const input = {
      name: "Feature 1",
      description: "Опис функції",
    };
    expect(() => featureFullSchema.parse(input)).toThrow(z.ZodError);
  });

  it("відхиляє об'єкт з нечисловим id", () => {
    const input = {
      id: "123",
      name: "Feature 1",
      description: "Опис функції",
    };
    expect(() => featureFullSchema.parse(input)).toThrow(z.ZodError);
  });
});
