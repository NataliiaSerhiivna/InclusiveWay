import { camelToSnakeCase } from "../../src/unitilies/camelSnakeModifications.js";

describe("camelToSnakeCase", () => {
  it("перетворює ключі з camelCase у snake_case", () => {
    const input = {
      firstName: "Іван",
      lastName: "Петренко",
      userId: 123,
      isActive: true,
    };

    const expected = {
      first_name: "Іван",
      last_name: "Петренко",
      user_id: 123,
      is_active: true,
    };

    expect(camelToSnakeCase(input)).toEqual(expected);
  });

  it("не змінює ключі без великих літер", () => {
    const input = {
      name: "Марія",
      age: 25,
    };

    expect(camelToSnakeCase(input)).toEqual(input);
  });

  it("працює з пустим об'єктом", () => {
    expect(camelToSnakeCase({})).toEqual({});
  });

  it("працює, якщо значення є null або undefined", () => {
    const input = {
      someValue: null,
      anotherValue: undefined,
    };

    const expected = {
      some_value: null,
      another_value: undefined,
    };

    expect(camelToSnakeCase(input)).toEqual(expected);
  });

  it("працює, якщо ключі мають кілька великих літер поспіль", () => {
    const input = {
      startURL: "http://example.com",
      APIKey: "abc123",
    };

    const expected = {
      start_u_r_l: "http://example.com",
      a_p_i_key: "abc123",
    };

    expect(camelToSnakeCase(input)).toEqual(expected);
  });
});
