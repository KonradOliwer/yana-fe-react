import NotesListSidebar from './NotesList';
import NotePage from './note/NotePage';
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addNote, deleteNote, getNotes, Note, NoteApiClientError, NoteApiErrorCode, updateNote } from './api';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [currentNote, setCurrentNote] = useState<Note | undefined>(undefined);
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
        }).catch((error: NoteApiClientError) => {
        if (error.code === NoteApiErrorCode.ALREADY_EXISTS) {
          console.info('Note already exists. Please refresh page to see it.');
          // TODO this should refresh list. Note we do not want to lose any currently opened and removed notes
        }
      }).catch(error => {
        console.error('Unknown error while creating note', error);
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
            setCurrentNote(undefined);
            navigate('/notes');
          }
        }).catch(error => {
        console.error('Error deleting note', error);
      });
    }
  }

  function updateOrCreateNote(note: Note): void {
    const noteIndex = notes.findIndex(n => n.id === note.id);
    if (noteIndex !== -1) {
      const newNotes = [...notes];
      newNotes[noteIndex] = note;
      setNotes(newNotes);
    }
    updateNote(note)
      .catch((error: NoteApiClientError) => {
        //TODO: this doesn't work - fix it; we get 404 thrown into logs and no more handling
        if (error.code === NoteApiErrorCode.ALREADY_EXISTS) {
          const userConfirmation = window.confirm('It seams this note was removed. Do you want to create new one with this data?');
          if (userConfirmation) {
            createNewNoteAndAddToList(note.name);
          }
        }
      });
  }

  return <div className="fixed top-14 left-64 bottom-0 right-0">
    <NotesListSidebar notes={notes} createNewNote={createNewNoteAndAddToList} deleteNote={deleteNoteAndRemoveFromList}
                      changeCurrentNote={changeCurrentNote} />
    <NotePage note={currentNote} saveNoteChanges={updateOrCreateNote} />
  </div>;
}