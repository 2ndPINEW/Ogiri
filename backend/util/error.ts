export interface ApiError {
  message: string;
  status: number;
}

export function createApiError(options: ApiError): ApiError {
  return {
    ...options,
  };
}

export function createApiErrorString(options: ApiError): string {
  return JSON.stringify(createApiError(options));
}
