import React from 'react';
import { fireEvent, render, screen } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import NotesList from './NotesList';

test('renders without crashing', () => {
  render(<Router><NotesList notes={[]} createNewNote={jest.fn()} deleteNote={jest.fn()} currentNoteId={undefined} /></Router>);
  expect(screen.getByRole('form')).toBeInTheDocument();
});

test('calls createNewNote when form is submitted', () => {
  let createNewNote = jest.fn();
  render(<Router><NotesList notes={[]} createNewNote={createNewNote} deleteNote={jest.fn()} currentNoteId={undefined} /></Router>);

  fireEvent.submit(screen.getByRole('form'));
  expect(createNewNote).toHaveBeenCalled();
});

test('calls deleteNote when delete button is clicked', async () => {
  let deleteNote = jest.fn();
  render(<Router><NotesList notes={[{ id: '1', name: 'note1', content: 'content1' }]} createNewNote={jest.fn()} deleteNote={deleteNote}
                            currentNoteId={undefined} /></Router>);

  let deleteButton = await screen.findByRole('button', { name: 'delete note' });
  fireEvent.click(deleteButton);
  expect(deleteNote).toHaveBeenCalled();
});

test('displays the correct number of notes', () => {
  render(<Router><NotesList notes={[
    { id: '1', name: 'note1', content: 'content1' },
    { id: '2', name: 'note2', content: 'content2' }
  ]} createNewNote={jest.fn} deleteNote={jest.fn()} currentNoteId={'1'} /></Router>);

  expect(screen.getAllByRole('listitem')).toHaveLength(2);
  expect(screen.getByText('note1')).toBeInTheDocument();
  expect(screen.getByText('note2')).toBeInTheDocument();
});