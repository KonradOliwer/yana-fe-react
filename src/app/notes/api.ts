const HOST = 'http://127.0.0.1:5000';


export enum NoteApiErrorCode {
  NOT_FOUND = 'NOTE_NOT_FOUND',
  BLANK_NAME = 'NOTE_WITH_BLANK_NAME',
  ALREADY_EXISTS = 'NOTE_ALREADY_EXISTS',
  NOT_MATCHING_URL_ID = 'NOT_MATCHING_URL_ID',

  //default value
  UNKNOWN_NOTE_ERROR_CODE = 'UNKNOWN_NOTE_ERROR_CODE'
}

function getNoteApiErrorCode(value: string): NoteApiErrorCode {
  return Object.values(NoteApiErrorCode).includes(value as NoteApiErrorCode) ? value as NoteApiErrorCode : NoteApiErrorCode.UNKNOWN_NOTE_ERROR_CODE;
}


export class NoteApiClientError extends Error {
  code: string;

  constructor(responseJson: { message?: string, code: string }) {
    super(responseJson.message ? responseJson.message : responseJson.code);
    this.name = 'NoteApiError';
    this.code = getNoteApiErrorCode(responseJson.code);

    // This line is needed to restore the correct prototype chain.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

function throwClientErrorIfApplicable(status: number, body: any) {
  if (status >= 400 && status < 500) {
    throw new NoteApiClientError(typeof body === 'string' ? JSON.parse(body) : body);
  }
}

export interface Note {
  id: string;
  name: string;
  content: string;
}

export const getNotes = async (): Promise<Note[]> => {
  const response = await fetch(`${HOST}/notes`);
  let responseJson = await response.json();
  return responseJson as Note[];
};

export const addNote = async (body: { name: string, content: string }): Promise<Note> => {
  const response = (await fetch(`${HOST}/notes/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  }));
  let responseJson = await response.json();
  if (response.status === 400) {
    throw new NoteApiClientError(responseJson);
  }
  return responseJson as Note;
};

export const getNoteByName = async (name: string): Promise<Note> => {
  const response = await fetch(`${HOST}/notes?name=${encodeURIComponent(name)}`);
  let responseJson = await response.json();
  throwClientErrorIfApplicable(response.status, responseJson);
  let notes = responseJson as Note[];
  if (notes.length === 0) {
    throw new NoteApiClientError({
      code: NoteApiErrorCode.NOT_FOUND
    });
  } else if (notes.length > 1) {
    // There is constraint of unique name in the database, so this will only happen if BE changes without FE change
    throw new NoteApiClientError({
      code: NoteApiErrorCode.UNKNOWN_NOTE_ERROR_CODE
    });
  }
  return notes[0];
};

export const updateNote = async (note: Note): Promise<Note> => {
  const response = await fetch(`${HOST}/notes/${note.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });
  let responseJson = await response.json();
  throwClientErrorIfApplicable(response.status, responseJson);
  return responseJson as Note;
};

export const deleteNote = async (id: string): Promise<void> => {
  const response = await fetch(`${HOST}/notes/${id}`, {
    method: 'DELETE'
  });
  if (response.status !== 204) {
    let responseJson = await response.json();
    throwClientErrorIfApplicable(response.status, responseJson);
  }
};