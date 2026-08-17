export const getErrorMessage = (
  error: unknown,
  defaultMessage: string
): string => {
  if (typeof error === "object" && error !== null) {
    const errorObject = error as {
      response?: {
        data?: {
          message?: string;
        };
      };
      message?: string;
    };

    return (
      errorObject.response?.data?.message ||
      errorObject.message ||
      defaultMessage
    );
  }

  if (error instanceof Error) {
    return error.message;
  }

  return defaultMessage;
};
