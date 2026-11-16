// The one error type that every service throws, so every form and page can handle errors the same way.
//   message     text that can be shown to the user
//   status      HTTP status (0 means the server could not be reached)
//   fieldErrors messages for single fields, like { email: "Already registered" }
//   code        short machine-readable reason, like "INVALID_CREDENTIALS"
export class ApiError extends Error {
  constructor(message, status = 0, fieldErrors, code) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.fieldErrors = fieldErrors;
    this.code = code;
  }
}