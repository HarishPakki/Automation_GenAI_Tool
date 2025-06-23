export default function paginate(data = [], page = 1, limit = 10) {
  const totalPages = Math.ceil(data.length / limit);
  const start = (page - 1) * limit;
  const end = start + limit;
  return {
    data: data.slice(start, end),
    totalPages
  };
}
