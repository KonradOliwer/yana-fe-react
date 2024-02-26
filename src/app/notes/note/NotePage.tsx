import React, { useEffect, useState } from 'react';
import MDEditor from '@uiw/react-md-editor';

import { Note } from '../api';

export default function NotePage({
  note,
  saveNoteChanges,
}: {
  note: Note | undefined;
  saveNoteChanges: (nore: Note) => void;
}) {
  return (
    <div className="p-4 sm:ml-64 mt-14 fixed top-0 left-0 bottom-0 right-0" id={note?.id}>
      <div className="p-4 border-2 border-gray-200 border-dashed rounded-lg dark:border-gray-700 w-full h-full">
        {note ? (
          <EditNoteBox note={note} saveNoteChanges={saveNoteChanges} />
        ) : (
          <>No note selected</>
        )}
      </div>
    </div>
  );
}

function EditNoteBox({
  note,
  saveNoteChanges,
}: {
  note: Note;
  saveNoteChanges: (nore: Note) => void;
}) {
  const [name, setNameValue] = useState<string>('');
  const [content, setContentValue] = useState<string>('');

  useEffect(() => {
    setNameValue(note.name);
    setContentValue(note.content);
  }, [note]);

  function submitNoteChanges() {
    saveNoteChanges({ id: note?.id, name: name, content: content } as Note);
  }

  function handleKeyDownInNameInput(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') submitNoteChanges();
  }

  return (
    <div className="relative w-full h-full">
      <div>
        <div className="absolute top-3 left-3 right-28 text-4xl">
          <input
            aria-label="edit note name"
            className="relative  w-full h-full flex-start focus:outline-0 placeholder:italic"
            type="text"
            value={name ?? ''}
            placeholder={name ? '' : 'Unnamed'}
            onChange={(e) => setNameValue(e.target.value)}
            onKeyDown={handleKeyDownInNameInput}
            maxLength={50}
          />
        </div>
        <div className="absolute top-0 right-6  text-end text-4xl">
          <button
            aria-label="save note"
            className={`border-2 border-black rounded-2xl p-3 shadow-2xl ${name === note.name && content === note.content ? 'bg-white ' : 'bg-blue-300  hover:bg-blue-500'}`}
            onClick={(e) => submitNoteChanges()}
          >
            <svg
              className="w-[48px] h-[48px] text-gray-800"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                fillRule="evenodd"
                d="M9 2.2V7H4.2l.4-.5 3.9-4 .5-.3Zm2-.2v5a2 2 0 0 1-2 2H4v11c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2h-7ZM8 16c0-.6.4-1 1-1h6a1 1 0 1 1 0 2H9a1 1 0 0 1-1-1Zm1-5a1 1 0 1 0 0 2h6a1 1 0 1 0 0-2H9Z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
      <div className="absolute left-0 right-0 bottom-0 top-24 ">
        <MDEditor
          height="100%"
          value={content}
          onChange={(s) => setContentValue(s ?? '')}
        />
      </div>
    </div>
  );
}
