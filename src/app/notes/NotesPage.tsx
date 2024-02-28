import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { addNote, deleteNote, getNotes, updateNote } from './api';
import { NoteViewLayout } from './note/NoteViewLayout';
import { NoteBox } from './note/NoteBox';
import NotesListSidebarLayout from './list/NotesListSidebarLayout';
import { SelectOrCreateNoteBox } from './list/SelectOrCreateNoteBox';
import { NotesList } from './list/NotesList';
import { Note } from './model';
import { ClientError, ErrorCode } from '../apiErrors';

export default function NotesPage() {
  const [notes, setNotes] = useState<Note[]>([]);
  const { noteId } = useParams() as { noteId: string | null };
  const navigate = useNavigate();

  useEffect(() => {
    getNotes()
      .then((notes) => {
        setNotes(notes);
      })
      .catch((error) => {
        console.error('Error fetching notes', error);
      });
  }, []);

  const currentNote = notes.find((note) => note.id === noteId);

  function createNewNote(name: string, content: string | undefined) {
    addNote({
      name: name.trim(),
      content: content ? content : '',
    })
      .then((addedNote) => {
        setNotes((ns) => [...ns.filter((note) => note.name !== addedNote.name), addedNote]);
        navigate(`/notes/${addedNote.id}`);
      })
      .catch((error: ClientError) => {
        if (error.code === ErrorCode.NOTE_ALREADY_EXISTS) {
          // This could happen if:
          // 1. user intentionally tries to break system by very quickly switching tabs and removing something in fly
          // 2. user has connections issues
          //TODO: system should support second case - display toastr with infor about issue
          console.info('Note already exists. Please refresh page to see it.');
        }
      })
      .catch((error) => {
        console.error('Unknown error while creating note', error);
      });
  }

  function selectOrCreateNote(name: string, content: string | undefined) {
    let trimmedName = name.trim();
    getNotes()
      .then((ns) => {
        setNotes(ns);
        let note = ns.find((note) => note.name === trimmedName);
        if (note) {
          navigate(`/notes/${note.id}`);
        } else {
          createNewNote(trimmedName, content);
        }
      })
      .catch((error) => {
        console.error('Error fetching notes', error);
      });
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
        getNotes().then((ns) => {
          setNotes(ns);
        });
      });
  }

  function updateOrCreateNote(note: Note): void {
    updateNote(note)
      .catch((error: ClientError) => {
        if (error.code === ErrorCode.NOTE_NOT_FOUND) {
          const userConfirmation = window.confirm(
            'It seams this note was removed. Do you want to create new one with this data?',
          );
          if (userConfirmation) {
            createNewNote(note.name, note.content);
          }
        }
      })
      .finally(() =>
        getNotes().then((ns) => {
          setNotes(ns);
        }),
      );
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
