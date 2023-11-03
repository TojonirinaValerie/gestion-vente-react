export interface ApiResponseType<T> {
  code: number;
  success: boolean;
  message: string;
  data: T;
}
