import axios from 'axios';

export enum ErrorCode {
  NOTE_NOT_FOUND = 'NOTE_NOT_FOUND',
  NOTE_ALREADY_EXISTS = 'NOTE_ALREADY_EXISTS',

  //default value
  UNKNOWN_ERROR_CODE = 'UNKNOWN_ERROR_CODE',
}

export class ClientError extends Error {
  code: string;

  constructor(responseJson: { message?: string; code: string }) {
    super(responseJson.message ? responseJson.message : responseJson.code);
    this.name = 'NoteApiError';
    this.code = getNoteApiErrorCode(responseJson.code);

    // This line is needed to restore the correct prototype chain.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function getNoteApiErrorCode(value: string): ErrorCode {
  return Object.values(ErrorCode).includes(value as ErrorCode)
    ? (value as ErrorCode)
    : ErrorCode.UNKNOWN_ERROR_CODE;
}

axios.interceptors.response.use(
  function (response) {
    return response;
  },
  function (error) {
    if (error.response.data.code) {
      return Promise.reject(new ClientError(error.response.data));
    }
    return Promise.reject(error);
  },
);
