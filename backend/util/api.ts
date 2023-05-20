type ApiErrorStatus =
  | "DB_ERROR"
  | "NOT_FOUND"
  | "USER_NOT_FOUND"
  | "ANSWER_TO_LONG"
  | "ALREADY_ENDED"
  | "BAD_REQUEST"
  | "UNKNOWN_ERROR"
  | "INVALID_API_KEY";

export interface ApiError {
  message: string;
  status: ApiErrorStatus;
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
  status: "SUCCESS",
};

export const SuccessString = JSON.stringify(Success);
