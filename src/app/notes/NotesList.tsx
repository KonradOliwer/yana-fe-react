import React from 'react';

import { Note } from './note/Note';
import { Link } from 'react-router-dom';


export default function NotesList({ notes, createNewNote }: {
  notes: Note[],
  createNewNote: (name: string) => void
}) {
  function addNoteClick(event: React.MouseEvent<HTMLButtonElement>) {
    event.preventDefault();
    createNewNote(event.currentTarget.value);
  }

  return <aside id="logo-sidebar"
                className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full bg-white border-r border-gray-200 sm:translate-x-0 dark:bg-gray-800 dark:border-gray-700"
                aria-label="Sidebar">
    <div className="h-full px-3 pb-4 overflow-y-auto bg-white dark:bg-gray-800  p-2 text-gray-900 rounded-lg dark:text-white">
      <div className="border-2 top-0 left-0">
        <div className="display: flex align-items: center">
          <button className="hover:bg-gray-100 dark:hover:bg-gray-700 group mt-3 mb-3 ml-1 mr-1" onClick={addNoteClick}>
            <svg className="w-[33px] h-[33px] text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none"
                 viewBox="0 0 24 24">
              <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M5 12h14m-7 7V5" />
            </svg>
          </button>
          <input type="text" className="w-fit ml-0 m-4 text-black" placeholder="Unnamed" />
        </div>
      </div>

      <br />

      <ul className="space-y-2 font-medium">
        {notes.map(note =>
          <li key={note.id}>
            <Link to={`/notes/${note.id}`}
                  className="flex items-center  hover:bg-gray-100 dark:hover:bg-gray-700 group">
              <span className="flex-1 ms-3 whitespace-nowrap">{note.name ? note.name : (<i>Unnamed</i>)}</span>
            </Link>
          </li>
        )}
      </ul>
    </div>
  </aside>;
}