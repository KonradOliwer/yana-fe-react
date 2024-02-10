import React from 'react';
import './App.css';
import UserTopBar from './notes/MainTopBar';
import NotesArea from './notes/NotesArea';


function App() {
  return (
    <div className="App">
      <UserTopBar />
      <NotesArea />
    </div>
  );
}

export default App;
