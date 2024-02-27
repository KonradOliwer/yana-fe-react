import { Note } from '../api';
import { Link } from 'react-router-dom';
import React from 'react';

export function NotesList({
  notes,
  deleteNote,
  currentNoteId,
}: {
  notes: Note[];
  deleteNote: (noteId: string) => void;
  currentNoteId: string | undefined;
}) {
  return (
    <ul className="space-y-2 font-medium absolute top-44">
      {notes.map((note) => (
        <li key={note.id}>
          <div className="flex w-auto">
            <button aria-label={`delete note ${note.id}`} onClick={(e) => deleteNote(note.id)}>
              <svg
                className="w-[18px] h-[18px] text-gray-800 dark:text-white"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18 18 6m0 12L6 6"
                />
              </svg>
            </button>
            <Link
              to={`/notes/${note.id}`}
              className="w-full hover:bg-gray-100 dark:hover:bg-gray-700"
            >
              <span
                className={`ms-3 whitespace-nowrap ${currentNoteId === note.id ? 'font-bold text-cyan-700 dark:text-cyan-200' : ''}`}
              >
                {note.name ? note.name : <i>Unnamed</i>}
              </span>
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
