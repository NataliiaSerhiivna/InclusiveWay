import fromDbToJSON from "../../src/unitilies/locationConverter.js";

describe("fromDbToJSON", () => {
  it("конвертує об'єкт з БД у правильний JSON формат", () => {
    const fullLocation = {
      id: 1,
      name: "Локація 1",
      address: "вул. Прикладна, 10",
      latitude: { toNumber: () => 50.1234 },
      longitude: { toNumber: () => 30.5678 },
      description: "Опис локації",
      created_by: "user123",
      approved: true,
      verified: false,
      created_at: new Date("2023-06-01T10:00:00Z"),
      features: [
        { id: 101, name: "Пандус", description: "Доступний пандус" },
        { id: 102, name: "Ліфт", description: "Швидкий ліфт" },
      ],
      location_photos: [
        {
          id: 201,
          location_id: 1,
          image_url: "https://example.com/photo1.jpg",
          description: "Фото 1",
          uploaded_at: new Date("2023-06-02T12:00:00Z"),
        },
      ],
      comments: [
        {
          id: 301,
          location_id: 1,
          user_id: "user456",
          content: "Дуже класна локація!",
          created_at: new Date("2023-06-03T14:30:00Z"),
        },
      ],
    };

    const expected = {
      id: 1,
      name: "Локація 1",
      address: "вул. Прикладна, 10",
      latitude: 50.1234,
      longitude: 30.5678,
      description: "Опис локації",
      createdBy: "user123",
      approved: true,
      verified: false,
      createdAt: "2023-06-01T10:00:00.000Z",
      features: [
        { id: 101, name: "Пандус", description: "Доступний пандус" },
        { id: 102, name: "Ліфт", description: "Швидкий ліфт" },
      ],
      photos: [
        {
          id: 201,
          locationId: 1,
          imageURL: "https://example.com/photo1.jpg",
          description: "Фото 1",
          uploadedAt: "2023-06-02T12:00:00.000Z",
        },
      ],
      comments: [
        {
          id: 301,
          locationId: 1,
          userId: "user456",
          content: "Дуже класна локація!",
          createdAt: "2023-06-03T14:30:00.000Z",
        },
      ],
    };

    const result = fromDbToJSON(fullLocation);

    expect(result).toEqual(expected);
  });
});
