export interface Pagination<T> {
    data: T | T[];
    perPage?: number;
    total?: number;
    totalPage?: number;
    currentPage?: number;
    count?: number;
}
