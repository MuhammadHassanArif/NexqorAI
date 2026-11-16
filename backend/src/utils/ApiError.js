// An error that we throw on purpose, with the HTTP status the client should receive.
// fieldErrors lets the frontend show a message under one specific field,
// for example { email: "An account with this email already exists." }
export class ApiError extends Error {
  constructor(statusCode, message, { fieldErrors, code } = {}) {
    super(message);
    this.name = "ApiError";
    this.statusCode = statusCode;
    this.fieldErrors = fieldErrors;
    this.code = code;
  }
}