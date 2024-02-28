import React from 'react';
import { act, render, screen, waitFor } from '@testing-library/react';
import NotesPage from './NotesPage';
import { Route, Router, Routes } from 'react-router-dom';
import * as api from './api';
import { createMemoryHistory, MemoryHistory } from 'history';
import userEvent from '@testing-library/user-event';
import { Note } from './model';

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

//END UTILS

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
    const contentAppend = ' updated content';
    const nameAppend = ' updated name';
    const expectedResponse = {
      id: exampleNote.id,
      name: exampleNote.name + nameAppend,
      content: exampleNote.content + contentAppend,
    };

    test('Saving note triggers updateNote with new attributes and refresh notes list', async () => {
      let initialNotes = [exampleNote];
      (api.getNotes as jest.Mock)
        .mockResolvedValueOnce(initialNotes)
        .mockResolvedValueOnce([expectedResponse]);
      (api.addOrUpdateNote as jest.Mock).mockResolvedValue(expectedResponse);

      const { history } = renderNotePage('/notes/' + exampleNote.id);
      await waitForNotesListToLoad(initialNotes);
      await waitForCurrentNoteToLoad();

      userEvent.type(screen.getByRole('textbox', { name: 'edit note name' }), nameAppend);
      userEvent.type(screen.getByTestId('MDEditor input'), contentAppend);
      expect(screen.getByRole('textbox', { name: 'edit note name' })).toHaveValue(
        expectedResponse.name,
      );
      userEvent.click(screen.getByRole('button', { name: 'save note' }));

      await waitForNotesListToLoad([expectedResponse]);
      expect(api.addOrUpdateNote).toHaveBeenCalledWith({
        name: expectedResponse.name,
        content: expectedResponse.content,
      });
      expect(history.location.pathname).toBe('/notes/' + exampleNote.id);
    });

    test('Saving Note note removed from the list on second tab', async () => {
      let initialNotes = [exampleNote];
      (api.getNotes as jest.Mock)
        .mockResolvedValueOnce(initialNotes)
        .mockResolvedValueOnce([expectedResponse]);
      (api.addOrUpdateNote as jest.Mock).mockResolvedValue(expectedResponse);

      const { history } = renderNotePage(/notes/ + exampleNote.id);
      await waitForNotesListToLoad(initialNotes);
      await waitForCurrentNoteToLoad();

      userEvent.type(screen.getByRole('textbox', { name: 'edit note name' }), nameAppend);
      userEvent.click(screen.getByRole('button', { name: 'save note' }));

      await waitForNotesListToLoad([expectedResponse]);

      expect(api.addOrUpdateNote).toHaveBeenCalledWith({
        name: expectedResponse.name,
        content: exampleNote.content,
      });
      expect(history.location.pathname).toBe('/notes/' + exampleNote.id);
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

      // eslint-disable-next-line testing-library/no-unnecessary-act
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
        (api.addOrUpdateNote as jest.Mock).mockResolvedValue(providedNote);
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
          expect(api.addOrUpdateNote).toHaveBeenCalledWith({
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
