type ApiErrorStatus =
  | 'DB_ERROR'
  | 'NOT_FOUND'
  | 'USER_NOT_FOUND'
  | 'ANSWER_TO_LONG'
  | 'ALREADY_ENDED'
  | 'BAD_REQUEST'
  | 'UNKNOWN_ERROR';

/**
 * ApiError時の返り値の型
 */
export interface ApiError {
  message: string;
  status: ApiErrorStatus;
  details?: string;
  hint?: string;
}

/**
 * ApiErrorかどうか判定するための型ガード
 */
export function isApiError(arg: any): arg is ApiError {
  return 'message' in arg && 'status' in arg && arg['status'] !== 'SUCCESS';
}

export interface Success {
  status: 'SUCCESS';
  message: 'Success';
}
