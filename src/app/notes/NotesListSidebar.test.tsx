import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import NotesListSidebar from './NotesListSidebar';

describe('NotesListSidebar', () => {
  test('renders without crashing', () => {
    render(
      <Router>
        <NotesListSidebar
          notes={[]}
          selectOrCreate={jest.fn()}
          deleteNote={jest.fn()}
          currentNoteId={undefined}
        />
      </Router>,
    );
    expect(screen.getByRole('form')).toBeInTheDocument();
  });
});

// As this is dumb component test of business logic are in NotesPage.test.tsx
