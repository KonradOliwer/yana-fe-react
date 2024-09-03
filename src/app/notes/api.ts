import { Note, NoteAttributes } from './model';
import { client } from '../apiConfig';

export const getNotes = async (): Promise<Note[]> => {
  return (await client.get(`/notes`)).data;
};

export const addNote = async (note: NoteAttributes): Promise<Note> => {
  return (await client.post(`/notes`, note)).data;
};

export const updateNote = async (note: Note): Promise<Note> => {
  return (await client.put(`/notes/${note.id}`, note)).data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await client.delete(`/notes/${id}`);
};
