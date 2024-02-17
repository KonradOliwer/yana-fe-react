import NotesListSidebar from './NotesList';
import NotePage from './note/NotePage';
import React, { useEffect, useState } from 'react';
import { Note } from './note/Note';
import { useParams } from 'react-router-dom';
import { addNote, getNotes } from './api';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const { noteId } = useParams() as { noteId: string | null };

  useEffect(() => {
    getNotes().then(notes => {
      setNotes(notes);
    }).catch(error => {
      console.error('Error fetching notes', error);
    });
  }, []);

  let filteredNotes = notes.filter(note => note.id === noteId);
  let selectedNote: Note | null = filteredNotes.length > 0 ? filteredNotes[0] : null;

  function createNewNote(name: string) {
    addNote({
      name: name,
      content: ''
    })
      .then(note => {
        setNotes(prevNotes => [...prevNotes, note]);
      });
  }

  return <div>
    <NotesListSidebar notes={notes} createNewNote={createNewNote} />

    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        {selectedNote ? <NotePage note={selectedNote} /> : (<>No note selected</>)}
      </div>
    </div>
  </div>;
}