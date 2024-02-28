import axios from 'axios';
import { Note, NoteAttributes } from './model';

export const getNotes = async (): Promise<Note[]> => {
  return (await axios.get(`/notes`)).data;
};

export const addOrUpdateNote = async (body: NoteAttributes): Promise<Note> => {
  return (await axios.post(`/notes`, body)).data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await axios.delete(`/notes/${id}`);
};
