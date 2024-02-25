/* eslint-disable testing-library/no-unnecessary-act */

import React from 'react';
import { act, render, screen } from '@testing-library/react';
import NotesPage from './NotesPage';
import { MemoryRouter, Route, Router, Routes } from 'react-router-dom';
import * as api from './api';
import { Note } from './api';
import { createMemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';

const exampleNote = { id: 'exampleId', name: 'note1', content: 'content1' };
const noteToDeleteId = 'noteToDeleteId';
const createNewNoteName = 'create new note name';
const createNewNoteContent = 'create new note content';
const noteToSave = {
  id: 'noteToSaveId',
  name: 'note to save name',
  content: 'note to save content',
};
const idPassedToNotePageTestId = 'current note id';
const namePassedToNotePageTestId = 'current note name';
const contentPassedToNotePageTestId = 'current note content';

jest.mock('./api');

jest.mock('./NotesList', () => {
  return {
    __esModule: true,
    default: ({
      notes,
      createNewNote,
      deleteNote,
      currentNoteI,
    }: {
      notes: Note[];
      createNewNote: (name: string, content: string | undefined) => void;
      deleteNote: (noteId: string) => void;
      currentNoteId: string | undefined;
    }) => {
      return (
        <div>
          <div>NotesList</div>
          <ul>
            {notes.map((note) => {
              return (
                <li key={note.id}>
                  <div id={`note ${note.id} name`}>{note.name}</div>
                  <div id={`note ${note.id} content`}>{note.content}</div>
                </li>
              );
            })}
          </ul>
          <div>
            <button
              onClick={() =>
                createNewNote(createNewNoteName, createNewNoteContent)
              }
            >
              createNote
            </button>
            <button onClick={() => deleteNote(noteToDeleteId)}>
              deleteNote
            </button>
          </div>
        </div>
      );
    },
  };
});

jest.mock('./note/NotePage', () => {
  return {
    __esModule: true,
    default: ({
      note,
      saveNoteChanges,
    }: {
      note: Note | undefined;
      saveNoteChanges: (nore: Note) => void;
    }) => {
      return (
        <div>
          {note ? (
            <>
              <div data-testid={idPassedToNotePageTestId}>{note?.id}</div>
              <div data-testid={namePassedToNotePageTestId}>{note?.name}</div>
              <div data-testid={contentPassedToNotePageTestId}>
                {note?.content}
              </div>
            </>
          ) : (
            <div>No note selected</div>
          )}
          <button onClick={() => saveNoteChanges(noteToSave)}>Save note</button>
        </div>
      );
    },
  };
});

test('renders NotesPage without crash', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([]);

  render(
    <MemoryRouter>
      <NotesPage />
    </MemoryRouter>,
  );
});

test('/notes/:id result in passing note with this id to NotePage', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([
    exampleNote,
    { id: '2', name: 'note2', content: 'content2' ,
  ]);

  const history = createMemoryHistory();
  history.push('/notes/2');

  await act(async () => {
    render(
      <Router navigator={history} location={history.location}>
        <Routes>
          <Route path={'/notes/:noteId'} element={<NotesPage />} />
        </Routes>
      </Router>,
    );
  });

  expect(screen.getByTestId(idPassedToNotePageTestId)).toHaveTextContent('2');
  expect(screen.getByTestId(namePassedToNotePageTestId)).toHaveTextContent(
    'note2'
  );
  expect(screen.getByTestId(contentPassedToNotePageTestId)).toHaveTextContent(
    'content2'
  );
});

test('/notes/ result in not passing note to NotePage', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([
    exampleNote,
    { id: '2', name: 'note2', content: 'content2' }
  ]);

  const history = createMemoryHistory();
  history.push('/notes/');

  await act(async () => {
    render(
      <Router navigator={history} location={history.location}>
        <Routes>
          <Route path={'/notes/'} element={<NotesPage />} />
        </Routes>
      </Router>,
    );
  });

  expect(screen.getByText('No note selected')).toBeInTheDocument();
});

test('/notes/:noteId with noteId that has no corresponding note on server', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([]);

  const history = createMemoryHistory();
  history.push('/notes/2');

  await act(async () => {
    render(
      <Router navigator={history} location={history.location}>
        <Routes>
          <Route path={'/notes/:noteId'} element={<NotesPage />} />
        </Routes>
      </Router>,
    );
  });

  expect(screen.getByText('No note selected')).toBeInTheDocument();
});

test('list of notes passed to NotesList', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([
    { id: '1', name: 'note1', content: 'content1' },
    { id: '2', name: 'note2', content: 'content2' }
  ]);

  // eslint-disable-next-line testing-library/no-unnecessary-act
  await act(async () => {
    render(
      <MemoryRouter>
        <NotesPage />
      </MemoryRouter>
    );
  });

  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(screen.getByText('note1')).toBeInTheDocument();
  expect(screen.getByText('content1')).toBeInTheDocument();
  expect(screen.getByText('note2')).toBeInTheDocument();
  expect(screen.getByText('content2')).toBeInTheDocument();
});

test('saveNoteChanges passed to NotePage triggers updateNote with new note version and refresh notes list', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([exampleNote]);
  (api.updateNote as jest.Mock).mockResolvedValue(Promise.resolve(noteToSave));

  await act(async () => {
    render(
      <MemoryRouter>
        <NotesPage />
      </MemoryRouter>
    );
  });

  expect(screen.getAllByRole('listitem')).toHaveLength(1);
  (api.getNotes as jest.Mock).mockResolvedValue([exampleNote, noteToSave]);

  await act(async () => {
    userEvent.click(screen.getByText('Save note'));
  });

  expect(api.updateNote).toHaveBeenCalledWith(noteToSave);
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(screen.getByText(exampleNote.name)).toBeInTheDocument();
  expect(screen.getByText(exampleNote.content)).toBeInTheDocument();
  expect(screen.getByText(noteToSave.name)).toBeInTheDocument();
  expect(screen.getByText(noteToSave.content)).toBeInTheDocument();
});

test('saveNoteChanges fails on updateNote with note not found and user confirms the intent to create new note', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([exampleNote]);
  (api.updateNote as jest.Mock).mockRejectedValue({
    code: api.NoteApiErrorCode.NOT_FOUND
  });
  (api.addNote as jest.Mock).mockResolvedValue(Promise.resolve(noteToSave));

  const confirmSpy = jest.spyOn(window, 'confirm');
  confirmSpy.mockImplementation(() => true);

  await act(async () => {
    render(
      <MemoryRouter>
        <NotesPage />
      </MemoryRouter>
    );
  });

  (api.getNotes as jest.Mock).mockResolvedValue([exampleNote, noteToSave]);

  await act(async () => {
    userEvent.click(screen.getByText('Save note'));
  });

  expect(api.addNote).toHaveBeenCalledWith({
    name: noteToSave.name,
    content: noteToSave.content
  });
  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(screen.getByText(noteToSave.name)).toBeInTheDocument();
  expect(screen.getByText(noteToSave.content)).toBeInTheDocument();
});

test('saveNoteChanges fails on updateNote with note not found and user reject the intent to create new note', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([]);
  (api.updateNote as jest.Mock).mockRejectedValue({
    code: api.NoteApiErrorCode.NOT_FOUND
  });
  (api.addNote as jest.Mock).mockResolvedValue(Promise.resolve(noteToSave));

  const confirmSpy = jest.spyOn(window, 'confirm');
  confirmSpy.mockImplementation(() => false);

  await act(async () => {
    render(
      <MemoryRouter>
        <NotesPage />
      </MemoryRouter>
    );
  });

  (api.getNotes as jest.Mock).mockResolvedValue([exampleNote]);

  await act(async () => {
    userEvent.click(screen.getByText('Save note'));
  });

  expect(api.addNote).not.toHaveBeenCalledWith({
    name: noteToSave.name,
    content: noteToSave.content
  });
  expect(screen.getAllByRole('listitem')).toHaveLength(1);
});

test('deleteNote passed to NotesList triggers deleteNote and refresh notes list if user confirms the action', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([exampleNote]);
  (api.deleteNote as jest.Mock).mockResolvedValue(Promise.resolve());

  const confirmSpy = jest.spyOn(window, 'confirm');
  confirmSpy.mockImplementation(() => true);

  await act(async () => {
    render(
      <MemoryRouter>
        <NotesPage />
      </MemoryRouter>
    );
  });

  expect(screen.getAllByRole('listitem')).toHaveLength(1);
  (api.getNotes as jest.Mock).mockResolvedValue([]);

  await act(async () => {
    userEvent.click(screen.getByText('deleteNote'));
  });

  expect(api.deleteNote).toHaveBeenCalledWith(noteToDeleteId);
  expect(screen.queryByRole('listitem')).not.toBeInTheDocument();
});

test('deleteNote passed to NotesList does nothing if user declines the action', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([exampleNote]);
  (api.deleteNote as jest.Mock).mockResolvedValue(Promise.resolve());

  const confirmSpy = jest.spyOn(window, 'confirm');
  confirmSpy.mockImplementation(() => false);

  await act(async () => {
    render(
      <MemoryRouter>
        <NotesPage />
      </MemoryRouter>
    );
  });
  (api.getNotes as jest.Mock).mockResolvedValue([]);

  expect(screen.getAllByRole('listitem')).toHaveLength(1);
  expect(api.deleteNote).not.toHaveBeenCalled();
});

test('deleteNote when confirmed and currently displayed note is being deleted redirect to notes/ and clear current note', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([
    { id: noteToDeleteId, name: 'note1', content: 'content1' }
  ]);
  (api.deleteNote as jest.Mock).mockResolvedValue(Promise.resolve());

  const confirmSpy = jest.spyOn(window, 'confirm');
  confirmSpy.mockImplementation(() => true);

  const history = createMemoryHistory();
  history.push('/notes/' + noteToDeleteId);

  await act(async () => {
    render(
      <Router navigator={history} location={history.location}>
        <Routes>
          <Route path={'/notes/:noteId'} element={<NotesPage />} />
        </Routes>
      </Router>,
    );
  });

  await act(async () => {
    userEvent.click(screen.getByText('deleteNote'));
  });

  expect(history.location.pathname).toBe('/notes');
});

test('Submitting note name in NotesList select note of this name for the list', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([
    { id: '1', name: createNewNoteName, content: createNewNoteContent }
  ]);

  const history = createMemoryHistory();
  history.push('/notes/x');

  await act(async () => {
    render(
      <Router navigator={history} location={history.location}>
        <Routes>
          <Route path={'/notes/:noteId'} element={<NotesPage />} />
        </Routes>
      </Router>,
    );
  });

  await act(async () => {
    userEvent.click(screen.getByText('createNote'));
  });

  expect(history.location.pathname).toBe('/notes/1');
});

test('Submitting note name in NotesList create new note if note with this name does not exist', async () => {
  (api.addNote as jest.Mock).mockResolvedValue({
    id: '1',
    name: createNewNoteName,
    content: createNewNoteContent
  });
  (api.getNotes as jest.Mock)
    .mockResolvedValueOnce([exampleNote])
    .mockResolvedValueOnce([exampleNote])
    .mockResolvedValueOnce([
      exampleNote,
      { id: '1', name: createNewNoteName, content: createNewNoteContent }
    ]);

  const confirmSpy = jest.spyOn(window, 'confirm');
  confirmSpy.mockImplementation(() => true);

  const history = createMemoryHistory();
  history.push('/notes/x');

  await act(async () => {
    render(
      <Router navigator={history} location={history.location}>
        <Routes>
          <Route path={'/notes/:noteId'} element={<NotesPage />} />
        </Routes>
      </Router>,
    );
  });

  await act(async () => {
    userEvent.click(screen.getByText('createNote'));
  });
  expect(api.addNote).toHaveBeenCalledWith({
    name: createNewNoteName,
    content: createNewNoteContent
  });
  expect(history.location.pathname).toBe('/notes/1');
});
