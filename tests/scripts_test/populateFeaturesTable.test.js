import { PrismaClient } from "@prisma/client";
import { featureCreateSchema } from "../../src/schemas/featureSchema.js";

jest.mock("@prisma/client", () => {
  const mPrismaClient = {
    features: {
      create: jest.fn(),
    },
  };
  return {
    PrismaClient: jest.fn(() => mPrismaClient),
  };
});

import { populateFeaturesTable } from "../../src/scripts/populateFeaturesTable.js";

describe("populateFeaturesTable", () => {
  let prismaMock;
  let consoleErrorSpy;

  beforeEach(() => {
    prismaMock = new PrismaClient();
    jest.clearAllMocks();
    consoleErrorSpy = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    consoleErrorSpy.mockRestore();
  });

  it("успішно створює записи для валідних фіч", async () => {
    const features = [
      {
        name: "Пандус",
        description: "Доступний пандус (нахил пандусу <=8%) біля входу",
      },
      {
        name: "Ліфт",
        description: "Двері >=90 см, без порогів з низькорозташованими кнопками",
      },
    ];


    populateFeaturesTable(features);

    await new Promise(process.nextTick);

    expect(prismaMock.features.create).toHaveBeenCalledTimes(features.length);
    features.forEach((feature, i) => {
      expect(prismaMock.features.create).toHaveBeenNthCalledWith(i + 1, {
        data: featureCreateSchema.parse(feature),
      });
    });
  });

  it("логить помилку валідації, якщо фічі не валідні", async () => {
    const badFeatures = [
      {
        name: "", 
        description: "Опис",
      },
    ];

    populateFeaturesTable(badFeatures);

    await new Promise(process.nextTick);

    expect(prismaMock.features.create).not.toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "Validation error:",
      expect.any(Array)
    );
  });
});
