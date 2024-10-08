import React, { useCallback, useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addNote, deleteNote, getNotes, updateNote } from './api';
import { NoteViewLayout } from './note/NoteViewLayout';
import { NoteBox } from './note/NoteBox';
import NotesListSidebarLayout from './list/NotesListSidebarLayout';
import { SelectOrCreateNoteBox } from './list/SelectOrCreateNoteBox';
import { NotesList } from './list/NotesList';
import { extractNoteAttributes, Note, NoteAttributes } from './model';
import { ClientError } from '../apiErrors';

function useRefreshNotes() {
  const [notes, setNotes] = useState<Note[]>([]);

  const refreshNotes = useCallback(() => {
    getNotes()
      .then((notesFromApi) => {
        setNotes(notesFromApi);
      })
      .catch((error) => console.error('Error fetching notes', error));
  }, []);

  return { notes, refreshNotes };
}

export default function NotesPage() {
  const { noteId } = useParams() as { noteId: string | null };
  const navigate = useNavigate();
  const { notes, refreshNotes } = useRefreshNotes(); // use the custom hook

  useEffect(() => {
    refreshNotes();
  }, [refreshNotes]);

  const currentNote = notes.find((note) => note.id === noteId);

  function createNote(note: NoteAttributes) {
    addNote(note)
      .then((addedNote) => {
        refreshNotes();
        navigate(`/notes/${addedNote.id}`);
      })
      .catch((error) => {
        console.error('Unknown error while creating note', error);
      });
  }

  function selectOrCreateNote(name: string, content: string | undefined) {
    refreshNotes();
    let trimmedName = name.trim();
    let note = notes.find((note) => note.name === trimmedName);
    if (note) {
      navigate(`/notes/${note.id}`);
    } else {
      createNote({ name: trimmedName, content: content ?? '' } as NoteAttributes);
    }
  }

  function deleteNoteAndRemoveFromList(id: string) {
    const userConfirmation = window.confirm('Are you sure you want to delete this note?');
    if (!userConfirmation) {
      return;
    }
    deleteNote(id)
      .then(() => {
        if (currentNote?.id === id) {
          navigate('/notes');
        }
      })
      .catch((error) => {
        console.error('Error deleting note', error);
      })
      .finally(() => {
        refreshNotes();
      });
  }

  function updateOrCreateNote(note: Note): void {
    updateNote(note)
      .then((addedNote) => {
        refreshNotes();
        navigate(`/notes/${addedNote.id}`);
      })
      .catch((error) => {
        if (error instanceof ClientError && error.code === 'NOTE_NOT_FOUND') {
          createNote(extractNoteAttributes(note));
        }
      });
  }

  return (
    <div className="fixed top-14 left-64 bottom-0 right-0">
      <NotesListSidebarLayout>
        <div className="border-2 top-0 left-0">
          <SelectOrCreateNoteBox selectOrCreate={selectOrCreateNote} />
        </div>
        <NotesList
          notes={notes}
          deleteNote={deleteNoteAndRemoveFromList}
          currentNoteId={currentNote?.id}
        />
      </NotesListSidebarLayout>
      <NoteViewLayout>
        {currentNote ? (
          <NoteBox key={currentNote.id} note={currentNote} saveNoteChanges={updateOrCreateNote} />
        ) : (
          <>No note selected</>
        )}
      </NoteViewLayout>
    </div>
  );
}
