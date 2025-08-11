export interface PaginatedResponse<T> {
  items: T[];
  page: number;
  pages: number;
}
