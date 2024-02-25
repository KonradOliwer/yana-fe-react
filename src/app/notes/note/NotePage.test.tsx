import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import { BrowserRouter as Router } from 'react-router-dom';
import React from 'react';
import NotePage from './NotePage';

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

test('renders NotePage without crashing', () => {
  render(
    <Router>
      <NotePage note={undefined} saveNoteChanges={(note) => {}} />
    </Router>,
  );
});

test('renders note content when note is defined', async () => {
  const note = { id: '1', name: 'Test Note', content: 'Test Content' };
  render(
    <Router>
      <NotePage note={note} saveNoteChanges={(note) => {}} />
    </Router>,
  );
  await waitFor(() => {
    expect(screen.getByDisplayValue('Test Note')).toBeInTheDocument();
  });
  await waitFor(() => {
    expect(screen.getByTestId('MDEditor input')).toHaveDisplayValue(
      'Test Content',
    );
  });
});

test('renders "No note selected" when note is undefined', async () => {
  render(
    <Router>
      <NotePage note={undefined} saveNoteChanges={(note) => {}} />
    </Router>,
  );

  await waitFor(() => {
    expect(screen.getByText('No note selected')).toBeInTheDocument();
  });
});

test('saveNoteChanges is called with correct values when button is pressed', async () => {
  const note = { id: '1', name: 'Test Note', content: 'Test Content' };
  const mockSaveNoteChanges = jest.fn();
  render(
    <Router>
      <NotePage note={note} saveNoteChanges={mockSaveNoteChanges} />
    </Router>,
  );

  // Simulate button press
  const button = screen.getByRole('button');
  fireEvent.click(button);

  // Check that saveNoteChanges was called with the correct arguments
  await waitFor(() => {
    expect(mockSaveNoteChanges).toHaveBeenCalledWith({
      id: '1',
      name: 'Test Note',
      content: 'Test Content',
    });
  });
});

test('saveNoteChanges is called with new value after inputs are changed', async () => {
  const note = { id: '1', name: 'Test Note', content: 'Test Content' };
  const mockSaveNoteChanges = jest.fn();
  render(
    <Router>
      <NotePage note={note} saveNoteChanges={mockSaveNoteChanges} />
    </Router>,
  );

  // Simulate name change
  const inputName = screen
    .queryAllByRole('textbox')
    .find((input) => input.getAttribute('data-testid') !== 'MDEditor input');
  if (inputName)
    fireEvent.change(inputName, { target: { value: 'Updated Note' } });

  // Simulate content change
  const inputContent = screen.getByTestId('MDEditor input');
  if (inputContent)
    fireEvent.change(inputContent, { target: { value: 'Updated Content' } });

  // Simulate button press
  const button = screen.getByRole('button');
  fireEvent.click(button);

  // Check that saveNoteChanges was called with the correct arguments
  await waitFor(() => {
    expect(mockSaveNoteChanges).toHaveBeenCalledWith({
      id: '1',
      name: 'Updated Note',
      content: 'Updated Content',
    });
  });
});
