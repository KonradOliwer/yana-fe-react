import React from 'react';
import { Note } from './Note';

export default function NoteArea({ note }: { note: Note | null }) {
  return (
    <div className="p-4 sm:ml-64">
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 mt-14">
        {note ?
          <>
            <h1>{note.name}</h1>
            <div>{note.content}</div>
          </>
          : <div>No note selected</div>
        }
      </div>
    </div>
  );
}