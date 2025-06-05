export function camelToSnakeCase(obj) {
  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`),
      value,
    ])
  );
}
