import axios from 'axios';
import { Note } from './model';

const HOST = 'http://127.0.0.1:5000';

export const getNotes = async (): Promise<Note[]> => {
  const response = await axios.get(`${HOST}/notes`);
  return (await response.data) as Note[];
};

export const addNote = async (body: { name: string; content: string }): Promise<Note> => {
  const response = await axios.post(`${HOST}/notes/`, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return (await response.data) as Note;
};

export const updateNote = async (note: Note): Promise<Note> => {
  const response = await axios.post(`${HOST}/notes/${note.id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(note),
  });
  return (await response.data) as Note;
};

export const deleteNote = async (id: string): Promise<void> => {
  const response = await axios.delete(`${HOST}/notes/${id}`);
  await response.data;
};


