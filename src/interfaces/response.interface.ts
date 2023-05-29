export interface ResponseData<T> {
    data?: T | T[];
    message?: string;
    statusCode?: number;
    error?: string;
}
