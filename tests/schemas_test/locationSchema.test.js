import { z } from "zod";
import {
  locationCreateSchema,
  locationUpdateSchema,
  locationFullSchema,
  bulkUpdateLocationFeaturesSchema,
} from "../../src/schemas/locationSchema.js";

describe("locationCreateSchema", () => {
  it("приймає валідний об'єкт і трансформує createdAt у Date", () => {
    const input = {
      name: "Локація",
      address: "Вулиця 123",
      latitude: 45.0,
      longitude: 30.0,
      description: "Достатньо довгий опис для тестування",
      approved: true,
      verified: false,
      createdAt: "2023-06-11T10:00:00Z",
      features: [1, 2],
      photos: [
        {
          imageURL: "http://example.com/photo.jpg",
          description: "Детальний опис фото більше 10 символів",
          uploadedAt: "2023-06-11T10:00:00Z",
        },
      ],
    };

    const result = locationCreateSchema.parse(input);

    expect(result.name).toBe(input.name);
    expect(result.createdAt).toBeInstanceOf(Date);
    expect(result.createdAt.toISOString()).toBe("2023-06-11T10:00:00.000Z");
    expect(result.features).toEqual([1, 2]);
    expect(result.photos).toHaveLength(1);
    expect(result.photos[0].imageURL).toBe("http://example.com/photo.jpg");
  });

  it("відхиляє об'єкт з порожнім масивом features", () => {
    const input = {
      name: "Локація",
      address: "Вулиця 123",
      latitude: 45,
      longitude: 30,
      description: "Достатньо довгий опис для тестування",
      approved: true,
      verified: false,
      createdAt: "2023-06-11T10:00:00Z",
      features: [],
      photos: [
        {
          imageURL: "http://example.com/photo.jpg",
          description: "Детальний опис фото більше 10 символів",
          uploadedAt: "2023-06-11T10:00:00Z",
        },
      ],
    };
    expect(() => locationCreateSchema.parse(input)).toThrow(z.ZodError);
  });

  it("відхиляє об'єкт з некоректним latitude", () => {
    const input = {
      name: "Локація",
      address: "Вулиця 123",
      latitude: 100, // поза межами
      longitude: 30,
      description: "Достатньо довгий опис для тестування",
      approved: true,
      verified: false,
      createdAt: "2023-06-11T10:00:00Z",
      features: [1],
      photos: [
        {
          imageURL: "http://example.com/photo.jpg",
          description: "Детальний опис фото більше 10 символів",
          uploadedAt: "2023-06-11T10:00:00Z",
        },
      ],
    };
    expect(() => locationCreateSchema.parse(input)).toThrow(z.ZodError);
  });
});

describe("locationUpdateSchema", () => {
  it("приймає частковий валідний об'єкт", () => {
    const input = {
      name: "Нова назва",
      approved: false,
    };
    const result = locationUpdateSchema.parse(input);
    expect(result.name).toBe("Нова назва");
    expect(result.approved).toBe(false);
  });

  it("відхиляє об'єкт з неприпустимими полями", () => {
    const input = {
      name: "Локація",
      extraField: "недозволене поле",
    };
    expect(() => locationUpdateSchema.parse(input)).toThrow(z.ZodError);
  });
});

describe("locationFullSchema", () => {
  it("приймає валідний повний об'єкт", () => {
    const input = {
      id: 5,
      createdBy: 1,
      name: "Локація",
      address: "Адреса",
      latitude: 50,
      longitude: 30,
      description: "Детальний опис локації більше 10 символів",
      approved: true,
      verified: false,
      createdAt: "2023-06-11T10:00:00Z",
      features: [
        { id: 1, name: "Feature 1", description: null },
        { id: 2, name: "Feature 2", description: "Опис" },
      ],
      photos: [
        {
          id: 10,
          locationId: 5,
          imageURL: "http://example.com/photo.jpg",
          description: "Детальний опис фото більше 10 символів",
          uploadedAt: "2023-06-11T10:00:00Z",
        },
      ],
      comments: [
        {
          id: 100,
          locationId: 5,
          userId: 20,
          content: "Коментар достатньої довжини",
          createdAt: "2023-06-11T10:00:00Z",
        },
      ],
    };

    const result = locationFullSchema.parse(input);

    expect(result.id).toBe(5);
    expect(result.createdBy).toBe(1);
    expect(result.features).toHaveLength(2);
    expect(result.photos).toHaveLength(1);
    expect(result.comments).toHaveLength(1);
    expect(result.createdAt).toBeInstanceOf(Date);
  });

  it("відхиляє об'єкт без обов'язкових полів", () => {
    const input = {
      id: 5,
      name: "Локація",
    };
    expect(() => locationFullSchema.parse(input)).toThrow(z.ZodError);
  });
});

describe("bulkUpdateLocationFeaturesSchema", () => {
  it("приймає валідний об'єкт з featuresToAdd і featuresToDelete", () => {
    const input = {
      featuresToAdd: [1, 2],
      featuresToDelete: [3],
    };
    const result = bulkUpdateLocationFeaturesSchema.parse(input);
    expect(result.featuresToAdd).toEqual([1, 2]);
    expect(result.featuresToDelete).toEqual([3]);
  });

  it("відхиляє об'єкт з нечисловими елементами", () => {
    const input = {
      featuresToAdd: [1, "two"],
      featuresToDelete: [3],
    };
    expect(() => bulkUpdateLocationFeaturesSchema.parse(input)).toThrow(z.ZodError);
  });
});
