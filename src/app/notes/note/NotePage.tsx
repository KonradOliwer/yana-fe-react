import React from 'react';

import { Note } from '../api';

export default function NotePage({ note }: { note: Note }) {
  return (
    <>
      <h1>{note.name}</h1>
      <div>{note.content}</div>
    </>
  );
}