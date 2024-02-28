const ERROR_CODES = [ 'UNKNOWN_ERROR_CODE'] as const;

type ErrorCode = typeof ERROR_CODES[number];

export class ClientError extends Error {
  code: ErrorCode;
  message: string;

  constructor(responseJson: { message?: string; code: string }) {
    super(responseJson.message ? responseJson.message : responseJson.code);
    this.name = 'NoteApiError';
    this.message = responseJson.message ? responseJson.message : responseJson.code;
    this.code = responseJson.code in ERROR_CODES ? responseJson.code as ErrorCode : 'UNKNOWN_ERROR_CODE';

    // This line is needed to restore the correct prototype chain.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}