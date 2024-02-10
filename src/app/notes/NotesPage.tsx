import NotesListSidebar from './NotesList';
import NotePage from './note/NotePage';
import React, { useEffect, useState } from 'react';
import { Note } from './note/Note';

export default function NotesPage() {
  const [currentNoteId, setCurrentNoteId] = useState<string | null>('1');
  const [notes, setNotes] = useState<Note[]>([]);

  useEffect(() => {
    fetch('http://localhost:8080/notes').then(r => r.json()).then(data => {
      setNotes(data as Note[]);
    });
  }, []);

  let filteredNotes = notes.filter(note => note.id === currentNoteId);
  let selectedNote: Note | null = filteredNotes.length > 0 ? filteredNotes[0] : null;

  return <div>
    <NotesListSidebar notes={notes} setCurrentNoteId={setCurrentNoteId} />
    <NotePage note={selectedNote} />
  </div>;
}