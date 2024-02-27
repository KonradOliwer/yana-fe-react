import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { NotesList } from './NotesList';

describe('NotesListSidebar', () => {
  test('renders without crashing', async () => {
    render(
      <Router>
        <NotesList
          notes={[{ id: '1', name: 'name', content: 'content' }]}
          deleteNote={(s) => {}}
          currentNoteId="1"
        />
      </Router>,
    );

    await waitFor(() => {
      expect(screen.getAllByRole('listitem')).toHaveLength(1);
    });
    expect(screen.getByText('name')).toBeInTheDocument();
  });
});

// As this is dumb component test of business logic are in NotesPage.test.tsx
