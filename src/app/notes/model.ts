export interface Note extends NoteAttributes {
  id: string;
}

export interface NoteAttributes {
  id: string;
  name: string;
  content: string;
}

export function extractNoteAttributes(note: Note): NoteAttributes {
  const { id, ...noteAttributes } = note;
  return noteAttributes as NoteAttributes;
}