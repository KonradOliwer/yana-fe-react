import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import { SelectOrCreateNoteBox } from './SelectOrCreateNoteBox';

describe('NotesListSidebar', () => {
  test('renders without crashing', () => {
    render(
      <Router>
        <SelectOrCreateNoteBox selectOrCreate={jest.fn()} />
      </Router>,
    );
    expect(screen.getByRole('form')).toBeInTheDocument();
  });
});

// As this is dumb component test of business logic are in NotesPage.test.tsx
