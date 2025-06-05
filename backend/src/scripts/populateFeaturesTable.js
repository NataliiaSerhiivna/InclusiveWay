import { PrismaClient } from "@prisma/client";
import { featureCreateSchema } from "../schemas/featureSchema.js";
import zod from "zod";
const prisma = new PrismaClient();

function populateFeaturesTable(features) {
  features.forEach(async (feature) => {
    try {
      const validFeature = featureCreateSchema.parse(feature);
      await prisma.features.create({
        data: validFeature,
      });
    } catch (error) {
      if (error.name === "ZodError") {
        console.error("Validation error:", error.issues);
      } else {
        console.error("Database error:", error.message);
      }
    }
  });
}

const features = [
  {
    name: "Пандус",
    description: "Доступний пандус (нахил пандусу <=8%) біля входу",
  },
  {
    name: "Ліфт",
    description: "Двері >=90 см, без порогів з низькорозташованими кнопками",
  },
  {
    name: "Рейки для візків",
    description:
      "Напрямні рейки для ручного котіння інвалідних або дитячих візків",
  },
  {
    name: "Доступна вбиральня",
    description: "Спеціально обладнаний туалет для людей з інвалідністю",
  },
  {
    name: "Стіл для пеленання",
    description: "Доступне місце для пеленання та іншого догляду за дітьми",
  },
  {
    name: "Широкі двері",
    description: "Двері ≥ 90 см, без порогів",
  },
  {
    name: "Кнопка виклику допомоги",
    description: "Кнопка біля входу для виклику працівника",
  },
  {
    name: "Парковка для людей з інвалідністю",
    description: "Наявність паркомісць для інвалідів",
  },
];

populateFeaturesTable(features);
