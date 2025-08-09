export type PaginatedResponse<T> = {
  items: T[];
  page: number;
  pages: number;
};
