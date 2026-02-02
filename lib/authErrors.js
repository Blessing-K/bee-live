/**
 * Maps AWS Cognito error codes to user-friendly messages
 */
export const getAuthErrorMessage = (error) => {
  // Handle string error messages
  if (typeof error === "string") {
    return error;
  }

  // Get the error code/name
  const errorCode = error?.code || error?.name || "";
  const errorMessage = error?.message || "";

  // Map specific error codes to user-friendly messages
  const errorMap = {
    UserNotFoundException:
      "No account found with this username. Please sign up first.",
    NotAuthorizedException: "Invalid username or password. Please try again.",
    UserNotConfirmedException:
      "Your email hasn't been verified yet. Please check your email for a verification link and confirm your account.",
    InvalidPasswordException:
      "Password must be at least 8 characters and meet complexity requirements.",
    UsernameExistsException:
      "This username is already taken. Please choose a different one.",
    InvalidParameterException:
      "Invalid input. Please check your email and password.",
    CodeMismatchException:
      "The verification code is incorrect. Please try again.",
    ExpiredCodeException:
      "The verification code has expired. Please request a new one.",
    LimitExceededException: "Too many login attempts. Please try again later.",
    TooManyRequestsException:
      "Too many requests. Please wait a moment before trying again.",
    PasswordResetRequired: "You must reset your password to continue.",
    UserLambdaValidationException:
      "Validation failed. Please check your input and try again.",
  };

  // Return mapped error or generic message
  return (
    errorMap[errorCode] ||
    errorMessage ||
    "An error occurred. Please try again."
  );
};

/**
 * Extracts relevant error information for debugging
 */
export const logAuthError = (error, context = "") => {
  console.error(`[Auth Error${context ? ` - ${context}` : ""}]`, {
    code: error?.code || error?.name,
    message: error?.message,
    fullError: error,
  });
};

/**
 * Checks if error is a specific type
 */
export const isAuthError = (error, errorType) => {
  return (error?.code || error?.name) === errorType;
};

/**
 * Determines if the error is retryable
 */
export const isRetryableError = (error) => {
  const errorCode = error?.code || error?.name || "";
  const retryableErrors = [
    "TooManyRequestsException",
    "LimitExceededException",
    "ServiceUnavailable",
  ];
  return retryableErrors.includes(errorCode);
};
