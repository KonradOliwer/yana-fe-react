import NotesListSidebar from './NotesList';
import NoteArea from './NoteArea';
import { useEffect, useState } from 'react';
import { Note } from './Note';

export default function NotesArea() {
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
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
    <NoteArea note={selectedNote} />
  </div>;
}