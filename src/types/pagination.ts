export interface Paged<T> {
  data: T[]
  count: number
}

export interface PaginationParams {
  page: number
  limit: number
}
