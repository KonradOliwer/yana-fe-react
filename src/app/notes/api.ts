const HOST = 'http://127.0.0.1:5000';


export enum NoteApiErrorCode {
  NOTE_ALREADY_EXISTS = 'NOTE_ALREADY_EXISTS',
  UNKNOWN_NOTE_ERROR_CODE = 'UNKNOWN_NOTE_ERROR_CODE'
}

function getNoteApiErrorCode(value: string): NoteApiErrorCode {
  if (Object.values(NoteApiErrorCode).includes(value as NoteApiErrorCode)) {
    return value as NoteApiErrorCode;
  }
  return NoteApiErrorCode.UNKNOWN_NOTE_ERROR_CODE; // default value
}


export class NoteApiError extends Error {
  code: string;

  constructor(responseJson: { message?: string, code: string }) {
    super(responseJson.message ? responseJson.message : responseJson.code);
    this.name = 'NoteApiError';
    this.code = getNoteApiErrorCode(responseJson.code);

    // This line is needed to restore the correct prototype chain.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

export interface Note {
  id: string;
  name: string;
  content: string;
}

export const getNotes = async (): Promise<Note[]> => {
  const response = await fetch(`${HOST}/notes`);
  return await response.json() as Note[];
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
    if (typeof responseJson === 'string') {
      responseJson = JSON.parse(responseJson);
    }
    throw new NoteApiError(responseJson);
  }
  return responseJson as Note;
};

export const getNote = async (id: string): Promise<Note> => {
  const response = await fetch(`${HOST}/notes/${id}`);
  return await response.json() as Note;
};

export const editNote = async (note: Note): Promise<Note> => {
  const response = await fetch(`${HOST}/notes/${note.id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });
  return await response.json() as Note;
};

export const deleteNote = async (id: string): Promise<void> => {
  const response = await fetch(`${HOST}/notes/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) {
    throw new Error('Failed to delete note');
  }
};