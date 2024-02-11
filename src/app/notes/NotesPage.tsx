import NotesListSidebar from './NotesList';
import NotePage from './note/NotePage';
import React, { useEffect, useState } from 'react';
import { Note } from './note/Note';
import { useParams } from 'react-router-dom';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const { noteId } = useParams() as { noteId: string | null };

  useEffect(() => {
    fetch('http://localhost:8080/notes').then(r => r.json()).then(data => {
      setNotes(data as Note[]);
    });
  }, []);

  let filteredNotes = notes.filter(note => note.id === noteId);
  let selectedNote: Note | null = filteredNotes.length > 0 ? filteredNotes[0] : null;

  return <div>
    <NotesListSidebar notes={notes} />
    {selectedNote ? <NotePage note={selectedNote} /> : (
      <div className="p-4 sm:ml-64">
        <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
          No note selected
        </div>
      </div>
    )}
  </div>;
}