import { Note, NoteAttributes } from './model';
import { clientWithAuth } from '../apiConfig';

export const getNotes = async (): Promise<Note[]> => {
  return (await clientWithAuth.get(`/notes`)).data;
};

export const addNote = async (note: NoteAttributes): Promise<Note> => {
  return (await clientWithAuth.post(`/notes`, note)).data;
};

export const updateNote = async (note: Note): Promise<Note> => {
  return (await clientWithAuth.put(`/notes/${note.id}`, note)).data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await clientWithAuth.delete(`/notes/${id}`);
};
