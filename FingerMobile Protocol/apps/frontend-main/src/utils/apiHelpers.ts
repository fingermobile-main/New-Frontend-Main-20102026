/**
 * Utility functions for handling API responses consistently across the application
 */

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message: string;
  error?: string;
  statusCode?: number;
}

/**
 * Creates a standardized success response
 */
export const createSuccessResponse = <T>(
  data: T,
  message: string = 'Operation successful'
): ApiResponse<T> => {
  return {
    success: true,
    data,
    message,
  };
};

/**
 * Creates a standardized error response
 */
export const createErrorResponse = (
  error: string,
  message: string = 'Operation failed',
  statusCode?: number
): ApiResponse<never> => {
  return {
    success: false,
    message,
    error,
    statusCode,
  };
};

/**
 * Handles API response and returns standardized format
 */
export const handleApiResponse = async <T>(
  apiCall: Promise<Response>,
  successMessage: string = 'Request successful',
  errorMessage: string = 'Request failed'
): Promise<ApiResponse<T>> => {
  try {
    const response = await apiCall;
    const data = await response.json();

    if (response.ok) {
      return createSuccessResponse(data, successMessage);
    } else {
      return createErrorResponse(
        data.message || errorMessage,
        errorMessage,
        response.status
      );
    }
  } catch (error: any) {
    return createErrorResponse(
      error.message || errorMessage,
      errorMessage
    );
  }
};

/**
 * Extracts error message from various error types
 */
export const extractErrorMessage = (error: any): string => {
  if (error.response?.data?.message) {
    return error.response.data.message;
  } else if (error.message) {
    return error.message;
  } else if (typeof error === 'string') {
    return error;
  } else {
    return 'An unexpected error occurred';
  }
};

/**
 * Type guard to check if a response is successful
 */
export const isSuccessfulResponse = <T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: true } => {
  return response.success === true && response.data !== undefined;
};

/**
 * Type guard to check if a response is an error
 */
export const isErrorReponse = <T>(response: ApiResponse<T>): response is ApiResponse<T> & { success: false } => {
  return response.success === false;
};
