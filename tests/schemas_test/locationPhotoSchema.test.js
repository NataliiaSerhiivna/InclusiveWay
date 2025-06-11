import { z } from "zod";
import {
  locationPhotoCreateSchema,
  lcoationPhotoFullSchema,
  bulkUpdateLocationPhotosSchema,
} from "../../src/schemas/locationPhotoSchema.js";

describe("locationPhotoCreateSchema", () => {
  it("приймає валідний об'єкт і трансформує uploadedAt у Date", () => {
    const input = {
      imageURL: "http://example.com/photo.jpg",
      description: "Це дуже докладний опис фото",
      uploadedAt: "2023-06-11T10:00:00Z",
    };
    const result = locationPhotoCreateSchema.parse(input);
    expect(result.imageURL).toBe(input.imageURL);
    expect(result.description).toBe(input.description);
    expect(result.uploadedAt).toBeInstanceOf(Date);
    expect(result.uploadedAt.toISOString()).toBe("2023-06-11T10:00:00.000Z");
  });

  it("відхиляє об'єкт з коротким description", () => {
    const input = {
      imageURL: "http://example.com/photo.jpg",
      description: "Коротко",
      uploadedAt: "2023-06-11T10:00:00Z",
    };
    expect(() => locationPhotoCreateSchema.parse(input)).toThrow(z.ZodError);
  });

  it("відхиляє об'єкт з некоректною датою uploadedAt", () => {
    const input = {
      imageURL: "http://example.com/photo.jpg",
      description: "Опис достатньої довжини",
      uploadedAt: "не дата",
    };
    expect(() => locationPhotoCreateSchema.parse(input)).toThrow(z.ZodError);
  });

  it("відхиляє об'єкт без imageURL", () => {
    const input = {
      description: "Опис достатньої довжини",
      uploadedAt: "2023-06-11T10:00:00Z",
    };
    expect(() => locationPhotoCreateSchema.parse(input)).toThrow(z.ZodError);
  });
});

describe("lcoationPhotoFullSchema", () => {
  it("приймає валідний повний об'єкт", () => {
    const input = {
      id: 1,
      locationId: 10,
      imageURL: "http://example.com/photo.jpg",
      description: "Достатньо довгий опис фото",
      uploadedAt: "2023-06-11T10:00:00Z",
    };
    const result = lcoationPhotoFullSchema.parse(input);
    expect(result.id).toBe(1);
    expect(result.locationId).toBe(10);
    expect(result.imageURL).toBe(input.imageURL);
    expect(result.description).toBe(input.description);
    expect(result.uploadedAt).toBeInstanceOf(Date);
  });

  it("відхиляє об'єкт без id", () => {
    const input = {
      locationId: 10,
      imageURL: "http://example.com/photo.jpg",
      description: "Достатньо довгий опис фото",
      uploadedAt: "2023-06-11T10:00:00Z",
    };
    expect(() => lcoationPhotoFullSchema.parse(input)).toThrow(z.ZodError);
  });

  it("відхиляє об'єкт без locationId", () => {
    const input = {
      id: 1,
      imageURL: "http://example.com/photo.jpg",
      description: "Достатньо довгий опис фото",
      uploadedAt: "2023-06-11T10:00:00Z",
    };
    expect(() => lcoationPhotoFullSchema.parse(input)).toThrow(z.ZodError);
  });
});

describe("bulkUpdateLocationPhotosSchema", () => {
  it("приймає валідний об'єкт з photosToAdd і photosToDelete", () => {
    const input = {
      photosToAdd: [
        {
          imageURL: "http://example.com/photo1.jpg",
          description: "Достатньо довгий опис для першого фото",
          uploadedAt: "2023-06-11T10:00:00Z",
        },
      ],
      photosToDelete: [1, 2, 3],
    };
    const result = bulkUpdateLocationPhotosSchema.parse(input);
    expect(Array.isArray(result.photosToAdd)).toBe(true);
    expect(Array.isArray(result.photosToDelete)).toBe(true);
    expect(result.photosToDelete).toEqual([1, 2, 3]);
  });

  it("відхиляє об'єкт з некоректним photosToAdd", () => {
    const input = {
      photosToAdd: [
        {
          imageURL: "http://example.com/photo1.jpg",
          description: "Коротко",
          uploadedAt: "2023-06-11T10:00:00Z",
        },
      ],
      photosToDelete: [1, 2],
    };
    expect(() => bulkUpdateLocationPhotosSchema.parse(input)).toThrow(z.ZodError);
  });

  it("відхиляє об'єкт з некоректним photosToDelete", () => {
    const input = {
      photosToAdd: [],
      photosToDelete: ["a", "b"],
    };
    expect(() => bulkUpdateLocationPhotosSchema.parse(input)).toThrow(z.ZodError);
  });
});
