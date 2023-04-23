export interface ApiError {
  message: string;
  status: number;
  details?: string;
  hint?: string;
}

export function createApiError(options: ApiError): ApiError {
  return {
    ...options,
  };
}

export function createApiErrorString(options: ApiError): string {
  return JSON.stringify(createApiError(options));
}

export const Success = {
  message: "Success",
  status: 200,
};

export const SuccessString = JSON.stringify(Success);
