// Конвертація параметрів пошуку локації в обєкт фільтрів

export default function locationSearchParametersConverter(req) {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const searchString = req.query.searchString || "";
  const filters = {
    searchString,
    page,
    limit,
  };
  return filters;
}
