import React from 'react';

import { Note } from './api';
import { Link } from 'react-router-dom';

export default function NotesList({
  notes,
  createNewNote: createOrOpenNote,
  deleteNote,
  currentNoteId,
}: {
  notes: Note[];
  createNewNote: (name: string, content: string | undefined) => void;
  deleteNote: (noteId: string) => void;
  currentNoteId: string | undefined;
}) {
  function addNoteClick(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    let name = formData.get('name') as string;
    createOrOpenNote(name, undefined);
  }

  return (
    <aside
      id="logo-sidebar"
      className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
      aria-label="Sidebar"
    >
      <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800  p-2 text-gray-900 rounded-lg dark:text-white">
        <div className="border-2 top-0 left-0">
          <form
            aria-label={'select note or add new'}
            className="display: flex align-items: center"
            onSubmit={addNoteClick}
          >
            <button
              aria-label={'select note or add new'}
              className="hover:bg-gray-100 dark:hover:bg-gray-700 group mt-3 m-2"
              type="submit"
            >
              <svg
                className="w-6 h-6 text-gray-800 dark:text-white"
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
                  d="M3 19V6c0-.6.4-1 1-1h4c.3 0 .6.1.8.4l1.9 2.2c.2.3.5.4.8.4H16c.6 0 1 .4 1 1v1M3 19l3-8h15l-3 8H3Z"
                />
              </svg>
            </button>
            <input
              type="text"
              name="name"
              className={`w-auto ml-0 m-4 text-black`}
              placeholder="Unnamed"
            />
          </form>
        </div>

        <ul className="space-y-2 font-medium">
          {notes.map((note) => (
            <li key={note.id}>
              <div className="flex w-auto">
                <button
                  aria-label="delete note"
                  onClick={(e) => deleteNote(note.id)}
                >
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
      </div>
    </aside>
  );
}