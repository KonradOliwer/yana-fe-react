import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import { NoteBox } from './NoteBox';

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

describe('NoteBox', () => {
  test('renders without crashing', async () => {
    render(
      <Router>
        <NoteBox
          noteId={'id'}
          note={{ id: 'id', name: 'name', content: 'content' }}
          saveNoteChanges={(node) => {}}
        />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getByDisplayValue('name')).toBeInTheDocument();
    });
    expect(screen.getByDisplayValue('content')).toBeInTheDocument();
  });
});

// As this is dumb component test of business logic are in NotesPage.test.tsx
