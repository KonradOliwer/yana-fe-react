import axios from 'axios';
import { Note } from './model';

export const getNotes = async (): Promise<Note[]> => {
  return (await axios.get(`/notes`)).data;
};

export const addNote = async (body: { name: string; content: string }): Promise<Note> => {
  return (await axios.post(`/notes`, body)).data;
};

export const updateNote = async (note: Note): Promise<Note> => {
  return (await axios.put(`/notes/${note.id}`, note)).data;
};

export const deleteNote = async (id: string): Promise<void> => {
  await axios.delete(`/notes/${id}`);
};
