import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import { BrowserRouter } from 'react-router-dom';

jest.mock('@uiw/react-md-editor', () => {
  return {
    __esModule: true,
    default: ({ height, value, onChange }: { height: string, value: string, onChange: (content: string) => void }) => {
      return <div></div>;
    }
  };
});

test('renders page without crash', () => {
  render(<BrowserRouter><App /></BrowserRouter>);
});
