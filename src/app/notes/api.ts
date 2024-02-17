import { Note } from './note/Note';

const HOST = 'http://127.0.0.1:5000';

export const getNotes = async (): Promise<Note[]> => {
  const response = await fetch(`${HOST}/notes`);
  return await response.json() as Note[];
};

export const addNote = async (body: { name: string, content: string }): Promise<Note> => {
  const response = await fetch(`${HOST}/notes/`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(body)
  });
  return await response.json() as Note;
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