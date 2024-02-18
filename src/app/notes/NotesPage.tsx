import NotesListSidebar from './NotesList';
import NotePage from './note/NotePage';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addNote, deleteNote, getNotes, Note, NoteApiError, NoteApiErrorCode } from './api';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | null>(null);
  const { noteId } = useParams() as { noteId: string | null };
  const navigate = useNavigate();

  useEffect(() => {
    getNotes().then(notes => {
      setNotes(notes);
      let note = notes.find(note => note.id === noteId);
      if (note) {
        setCurrentNote(note);
      }
    }).catch(error => {
      console.error('Error fetching notes', error);
    });
  }, [noteId]);

  function changeCurrentNote(note: Note) {
    navigate(`/notes/${note.id}`);
    setCurrentNote(note);
  }

  function createNewNoteAndAddToList(name: string) {
    const note = notes.find(note => note.name === name.trim());
    if (!note) {
      addNote({
        name: name.trim(),
        content: ''
      })
        .then(note => {
          changeCurrentNote(note);
        }).catch((error: NoteApiError) => {
        if (error.code === NoteApiErrorCode.NOTE_ALREADY_EXISTS) {
          console.info('Note already exists. Please refresh page to see it.');
          // TODO this should refresh list. Note we do not want to lose any currently opened and removed notes
        }
      }).catch(error => {
        console.error('Unknown error', error);
      });
    } else {
      changeCurrentNote(note);
    }
  }

  function deleteNoteAndRemoveFromList(id: string) {
    const userConfirmation = window.confirm('Are you sure you want to delete this note?');
    if (!userConfirmation) {
      return;
    }
    const noteToDelete = notes.find(note => note.id === id);
    if (noteToDelete) {
      setNotes(notes.filter(note => note.id !== id));
      deleteNote(noteToDelete.id)
        .then(() => {
          if (noteToDelete.id === currentNote?.id) {
            setCurrentNote(null);
            navigate('/notes');
          }
        }).catch(error => {
        console.error('Error deleting note', error);
      });
    }
  }

  return <div>
    <NotesListSidebar notes={notes} createNewNote={createNewNoteAndAddToList} deleteNote={deleteNoteAndRemoveFromList} changeCurrentNote={changeCurrentNote} />

    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        {currentNote ? <NotePage note={currentNote} /> : (<>No note selected</>)}
      </div>
    </div>
  </div>;
}