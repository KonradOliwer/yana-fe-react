/* eslint-disable testing-library/no-unnecessary-act */

import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import NotesPage from './NotesPage';
import { Route, Router, Routes } from 'react-router-dom';
import * as api from './api';
import { createMemoryHistory, MemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';

const exampleNote = { id: 'exampleId', name: 'note1', content: 'content1' };
const noteToDeleteId = 'noteToDeleteId';
const createNewNoteName = 'create new note name';
const createNewNoteContent = 'create new note content';
const noteToSave = {
  id: 'noteToSaveId',
  name: 'note to save name',
  content: '',
};

jest.mock('./api');

jest.mock(
  '@uiw/react-md-editor',
  () =>
    ({
      height,
      value,
      onChange,
    }: {
      height: string;
      value: string;
      onChange: (content: string) => void;
    }) => {
      return (
        <div>
          <input
            data-testid="MDEditor input"
            defaultValue={value}
            onChange={(e) => onChange(e.target.value)}
          />
        </div>
      );
    },
);

test('renders NotesPage without crash', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([]);

  renderNotePage();
});

test('/notes/:id result in passing note with this id to NotePage', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([
    exampleNote,
    { id: '2', name: 'note2', content: 'content2' },
  ]);

  renderNotePage('/notes/2');

  await waitFor(() => {
    expect(screen.getByRole('textbox', { name: 'edit note name' })).toHaveValue('note2');
  });
  expect(await screen.findByTestId('MDEditor input')).toHaveValue('content2');
});

test('/notes/ result in not passing note to NotePage', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([
    exampleNote,
    { id: '2', name: 'note2', content: 'content2' },
  ]);

  renderNotePage('/notes/2');

  expect(screen.getByText('No note selected')).toBeInTheDocument();
});

test('/notes/:noteId with noteId that has no corresponding note on server', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([]);

  renderNotePage('/notes/2');

  expect(screen.getByText('No note selected')).toBeInTheDocument();
});

test('list of notes passed to NotesList', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([
    { id: '1', name: 'note1', content: 'content1' },
    { id: '2', name: 'note2', content: 'content2' },
  ]);

  renderNotePage();

  await waitFor(() => {
    expect(screen.getAllByRole('listitem')).toHaveLength(2);
  });
  expect(screen.getByText('note1')).toBeInTheDocument();
  expect(screen.getByText('note2')).toBeInTheDocument();
});

test('Saving Note triggers updateNote with new note version and refresh notes list', async () => {
  const expectedNote = {
    id: exampleNote.id,
    name: exampleNote.name + ' updated name',
    content: exampleNote.content + ' updated content',
  };
  (api.getNotes as jest.Mock)
    .mockResolvedValueOnce([exampleNote])
    .mockResolvedValueOnce([expectedNote]);
  (api.updateNote as jest.Mock).mockResolvedValue({});

  renderNotePage('/notes/' + exampleNote.id);

  await waitFor(() => {
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'save note' })).toBeInTheDocument();
  });
  userEvent.type(screen.getByRole('textbox', { name: 'edit note name' }), ' updated name');
  userEvent.type(screen.getByTestId('MDEditor input'), ' updated content');
  //We want to wait for re-redneding of the input
  await waitFor(() => {
    expect(screen.getByRole('textbox', { name: 'edit note name' })).toHaveValue(expectedNote.name);
  });
  userEvent.click(screen.getByRole('button', { name: 'save note' }));

  await waitFor(() => {
    expect(api.updateNote).toHaveBeenCalledWith(expectedNote);
  });
  await waitFor(() => {
    expect(screen.getByText(expectedNote.name)).toBeInTheDocument();
  });
  expect(screen.getAllByRole('listitem')).toHaveLength(1);
});

test('Saving Note fails on updateNote with note not found and user confirms the intent to create new note', async () => {
  (api.getNotes as jest.Mock)
    .mockResolvedValueOnce([exampleNote])
    .mockResolvedValueOnce([exampleNote])
    .mockResolvedValueOnce([exampleNote, noteToSave]);
  (api.updateNote as jest.Mock).mockRejectedValue({
    code: api.NoteApiErrorCode.NOT_FOUND,
  });
  (api.addNote as jest.Mock).mockResolvedValue(Promise.resolve(noteToSave));

  const confirmSpy = jest.spyOn(window, 'confirm');
  confirmSpy.mockImplementation(() => true);

  renderNotePage();
  userEvent.type(screen.getByRole('textbox', {name:'add or select note'}), noteToSave.name);
  userEvent.click(screen.getByRole('button', { name: 'select note or add new' }));

  await waitFor(() => {
    expect(api.addNote).toHaveBeenCalledWith({
      name: noteToSave.name,
      content: '',
    });
  });
});

test('Saving Note fails on updateNote with note not found and user reject the intent to create new note', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([exampleNote]);
  (api.updateNote as jest.Mock).mockRejectedValue({
    code: api.NoteApiErrorCode.NOT_FOUND,
  });
  (api.addNote as jest.Mock).mockResolvedValue(Promise.resolve(noteToSave));

  const confirmSpy = jest.spyOn(window, 'confirm');
  confirmSpy.mockImplementation(() => false);

  renderNotePage('/notes/' + exampleNote.id);

  (api.getNotes as jest.Mock).mockResolvedValue([exampleNote]);

  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'save note' })).toBeInTheDocument();
  });
  userEvent.click(screen.getByRole('button', { name: 'save note' }));

  await waitFor(() => {
    expect(api.addNote).not.toHaveBeenCalledWith({
      name: noteToSave.name,
      content: noteToSave.content,
    });
  });
  await waitFor(() => {
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
});

test('deleteNote passed to NotesList triggers deleteNote and refresh notes list if user confirms the action', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([
    { id: noteToDeleteId, name: 'note1', content: 'content1' },
  ]);
  (api.deleteNote as jest.Mock).mockResolvedValue(Promise.resolve());

  const confirmSpy = jest.spyOn(window, 'confirm');
  confirmSpy.mockImplementation(() => true);

  renderNotePage();

  await waitFor(() => {
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
  (api.getNotes as jest.Mock).mockResolvedValue([]);

  userEvent.click(screen.getByRole('button', { name: 'delete note ' + noteToDeleteId }));

  await waitFor(() => expect(api.deleteNote).toHaveBeenCalledWith(noteToDeleteId));
  await waitFor(() => expect(screen.queryByRole('listitem')).not.toBeInTheDocument());
});

test('deleteNote passed to NotesList does nothing if user declines the action', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([exampleNote]);
  (api.deleteNote as jest.Mock).mockResolvedValue(Promise.resolve());

  const confirmSpy = jest.spyOn(window, 'confirm');
  confirmSpy.mockImplementation(() => false);

  renderNotePage();
  (api.getNotes as jest.Mock).mockResolvedValue([]);

  await waitFor(() => {
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
  expect(api.deleteNote).not.toHaveBeenCalled();
});

test('deleteNote when confirmed and currently displayed note is being deleted redirect to notes/ and clear current note', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([
    { id: noteToDeleteId, name: 'note1', content: 'content1' },
  ]);
  (api.deleteNote as jest.Mock).mockResolvedValue(Promise.resolve());

  const confirmSpy = jest.spyOn(window, 'confirm');
  confirmSpy.mockImplementation(() => true);

  let { history } = renderNotePage('/notes/' + noteToDeleteId);

  await waitFor(() => {
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });
  userEvent.click(screen.getByRole('button', { name: 'delete note ' + noteToDeleteId }));

  await waitFor(() => {
    expect(history.location.pathname).toBe('/notes');
  });
});

test('Submitting note name in NotesList select note of this name for the list', async () => {
  (api.getNotes as jest.Mock).mockResolvedValue([
    { id: '1', name: createNewNoteName, content: createNewNoteContent },
  ]);

  let { history } = renderNotePage('/notes/x');
  await waitFor(() => {
    expect(screen.getAllByRole('listitem')).toHaveLength(1);
  });

  userEvent.type(screen.getByPlaceholderText('Unnamed'), createNewNoteName);
  userEvent.click(screen.getByRole('button', { name: 'select note or add new' }));

  await waitFor(() => {
    expect(history.location.pathname).toBe('/notes/1');
  });
});

test('Submitting note name in NotesList create new note if note with this name does not exist', async () => {
  (api.addNote as jest.Mock).mockResolvedValue({
    id: '1',
    name: createNewNoteName,
    content: createNewNoteContent,
  });
  (api.getNotes as jest.Mock)
    .mockResolvedValueOnce([exampleNote])
    .mockResolvedValueOnce([exampleNote])
    .mockResolvedValueOnce([
      exampleNote,
      { id: '1', name: createNewNoteName, content: createNewNoteContent },
    ]);

  const confirmSpy = jest.spyOn(window, 'confirm');
  confirmSpy.mockImplementation(() => true);

  let { history } = renderNotePage('/notes/x');

  userEvent.type(screen.getByPlaceholderText('Unnamed'), createNewNoteName);
  userEvent.click(screen.getByRole('button', { name: 'select note or add new' }));

  await waitFor(() => {
    expect(api.addNote).toHaveBeenCalledWith({
      name: createNewNoteName,
      content: '',
    });
  });
  await waitFor(() => {
    expect(history.location.pathname).toBe('/notes/1');
  });
});

function renderNotePage(startingPath: string = '/notes'): {
  history: MemoryHistory;
} {
  const history = createMemoryHistory();
  history.push(startingPath);

  render(
    <Router navigator={history} location={history.location}>
      <Routes>
        <Route path={'/notes/:noteId'} element={<NotesPage />} />
        <Route path={'/notes'} element={<NotesPage />} />
      </Routes>
    </Router>,
  );

  return { history: history };
}
