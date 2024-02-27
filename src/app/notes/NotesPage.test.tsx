/* eslint-disable testing-library/no-unnecessary-act */

import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import NotesPage from './NotesPage';
import { Route, Router, Routes } from 'react-router-dom';
import * as api from './api';
import { Note } from './api';
import { createMemoryHistory, MemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';

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

describe('NotesPage', () => {

  test('renders NotesPage without crash', async () => {
    (api.getNotes as jest.Mock).mockResolvedValue([]);

    renderNotePage();
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

  describe('NotesPage show display of note depending on current url', () => {
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
  });

  describe('NotesPage updating current note', () => {
    const noteToSave = {
      id: 'noteToSaveId',
      name: 'note to save name',
      content: '',
    };

    test('Saving note triggers updateNote with new note version and refresh notes list', async () => {
      const expected = {
        id: exampleNote.id,
        name: exampleNote.name + ' updated name',
        content: exampleNote.content + ' updated content',
      };
      let initialNotesList = [exampleNote];
      (api.getNotes as jest.Mock)
        .mockResolvedValueOnce(initialNotesList)
        .mockResolvedValueOnce([expected]);
      (api.updateNote as jest.Mock).mockResolvedValue({});

      renderNotePage('/notes/' + exampleNote.id);
      await waitForNotesListToLoad(initialNotesList);
      await waitForCurrentNoteToLoad();

      userEvent.type(screen.getByRole('textbox', { name: 'edit note name' }), ' updated name');
      userEvent.type(screen.getByTestId('MDEditor input'), ' updated content');
      expect(screen.getByRole('textbox', { name: 'edit note name' })).toHaveValue(expected.name);
      userEvent.click(screen.getByRole('button', { name: 'save note' }));

      await waitForNotesListToLoad([expected]);
      expect(api.updateNote).toHaveBeenCalledWith(expected);
    });

    test('Saving Note fails on updateNote with note not found and user confirms the intent to create new note', async () => {
      let initialNotes = [exampleNote];
      const expected = {
        id: exampleNote.id,
        name: exampleNote.name + ' updated name',
        content: exampleNote.content,
      };
      (api.getNotes as jest.Mock)
        .mockResolvedValueOnce(initialNotes)
        .mockResolvedValueOnce([])
        .mockResolvedValueOnce([expected]);
      (api.updateNote as jest.Mock).mockRejectedValue({
        code: api.NoteApiErrorCode.NOT_FOUND,
      });
      (api.addNote as jest.Mock).mockResolvedValue(Promise.resolve(expected));
      mockConfirmPopupUserAnswer(true);

      renderNotePage(/notes/ + exampleNote.id);
      await waitForNotesListToLoad(initialNotes);
      await waitForCurrentNoteToLoad();

      userEvent.type(screen.getByRole('textbox', { name: 'edit note name' }), ' updated name');
      userEvent.click(screen.getByRole('button', { name: 'save note' }));

      await waitForNotesListToLoad([expected]);
      expect(api.addNote).toHaveBeenCalledWith({
        name: expected.name,
        content: expected.content,
      });
    });

    test('Saving Note fails on updateNote with note not found and user reject the intent to create new note', async () => {
      (api.getNotes as jest.Mock).mockResolvedValue([exampleNote]);
      (api.updateNote as jest.Mock).mockRejectedValue({
        code: api.NoteApiErrorCode.NOT_FOUND,
      });
      mockConfirmPopupUserAnswer(false);

      renderNotePage('/notes/' + exampleNote.id);
      await waitForNotesListToLoad([exampleNote]);
      await waitForCurrentNoteToLoad();

      userEvent.click(screen.getByRole('button', { name: 'save note' }));

      await waitFor(() => {
        expect(api.getNotes).toHaveBeenCalledTimes(2);
      });
      expect(api.addNote).not.toBeCalled();
    });
  });

  describe('NotesPage delete  note', () => {
    const noteToDelete = { id: 'noteToDeleteId', name: 'note1', content: 'content1' };

    test('delete note refresh notes list if user confirms the action', async () => {
      (api.getNotes as jest.Mock).mockResolvedValueOnce([noteToDelete]).mockResolvedValueOnce([]);
      (api.deleteNote as jest.Mock).mockResolvedValue(Promise.resolve());
      mockConfirmPopupUserAnswer(true);

      renderNotePage();
      await waitForNotesListToLoad([noteToDelete]);

      userEvent.click(screen.getByRole('button', { name: 'delete note ' + noteToDelete.id }));

      await waitFor(() => expect(api.deleteNote).toHaveBeenCalledWith(noteToDelete.id));
      await waitFor(() => expect(screen.queryByRole('listitem')).not.toBeInTheDocument());
    });

    test('delete note does nothing if user declines the action', async () => {
      (api.getNotes as jest.Mock).mockResolvedValue([noteToDelete]);
      (api.deleteNote as jest.Mock).mockResolvedValue(Promise.resolve());
      mockConfirmPopupUserAnswer(false);

      renderNotePage();
      await waitForNotesListToLoad([noteToDelete]);

      act(() => {
        userEvent.click(screen.getByRole('button', { name: 'delete note ' + noteToDelete.id }));
      });

      expect(api.getNotes).toHaveBeenCalledTimes(1);
      expect(api.deleteNote).not.toHaveBeenCalled();
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
    });

    test('delete note currently displayed note', async () => {
      (api.getNotes as jest.Mock).mockResolvedValueOnce([noteToDelete]).mockResolvedValueOnce([]);
      (api.deleteNote as jest.Mock).mockResolvedValue(Promise.resolve());
      mockConfirmPopupUserAnswer(true);

      let { history } = renderNotePage('/notes/' + noteToDelete.id);
      await waitForNotesListToLoad([noteToDelete]);

      userEvent.click(screen.getByRole('button', { name: 'delete note ' + noteToDelete.id }));

      await waitFor(() => expect(api.deleteNote).toHaveBeenCalledWith(noteToDelete.id));
      await waitFor(() => expect(screen.queryByRole('listitem')).not.toBeInTheDocument());
      await waitFor(() => {
        expect(history.location.pathname).toBe('/notes');
      });
    });

    describe('NotesPage select or create note', () => {
      const providedNote = {
        id: 'provided id',
        name: 'provided name',
        content: '',
      };

      test('Submitting note name in NotesList select note of this name for the list', async () => {
        (api.getNotes as jest.Mock).mockResolvedValue([providedNote]);

        let { history } = renderNotePage('/notes/x');
        await waitForNotesListToLoad([providedNote]);

        userEvent.type(
          screen.getByRole('textbox', { name: 'add or select note' }),
          providedNote.name,
        );
        userEvent.click(screen.getByRole('button', { name: 'select note or add new' }));

        await waitFor(() => {
          expect(history.location.pathname).toBe('/notes/' + providedNote.id);
        });
      });

      test('Submitting note name in NotesList create new note if note with this name does not exist', async () => {
        (api.addNote as jest.Mock).mockResolvedValue(providedNote);
        (api.getNotes as jest.Mock)
          .mockResolvedValueOnce([exampleNote])
          .mockResolvedValueOnce([exampleNote])
          .mockResolvedValueOnce([exampleNote, providedNote]);

        let { history } = renderNotePage('/notes/x');

        userEvent.type(
          screen.getByRole('textbox', { name: 'add or select note' }),
          providedNote.name,
        );
        userEvent.click(screen.getByRole('button', { name: 'select note or add new' }));

        await waitFor(() => {
          expect(api.addNote).toHaveBeenCalledWith({
            name: providedNote.name,
            content: '',
          });
        });
        await waitFor(() => {
          expect(history.location.pathname).toBe('/notes/' + providedNote.id);
        });
      });
    });
  });
});


//UTILS
const exampleNote = { id: 'exampleId', name: 'note1', content: 'content1' };

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

async function waitForCurrentNoteToLoad() {
  await waitFor(() => {
    expect(screen.getByRole('button', { name: 'save note' })).toBeInTheDocument();
  });
}

async function waitForNotesListToLoad(initialNotesList: Note[]) {
  await waitFor(() =>
    expect(screen.getAllByRole('listitem')).toHaveLength(initialNotesList.length),
  );
  for (let note of initialNotesList) {
    const nameElement = await screen.findByText(note.name);
    expect(nameElement).toBeInTheDocument();
  }
}

function mockConfirmPopupUserAnswer(answer: boolean) {
  const confirmSpy = jest.spyOn(window, 'confirm');
  confirmSpy.mockImplementation(() => answer);
}
