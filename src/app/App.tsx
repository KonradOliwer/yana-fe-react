import React from 'react';
import './App.css';
import UserTopBar from './notes/MainTopBar';
import NotesPage from './notes/NotesPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import About from './about/about';
import { NoPageFound } from './Errors';


function App() {

  return (
    <div className="App">
      <UserTopBar />
      <Routes>
        <Route path="/" element={<Navigate to="/notes" />} />
        <Route path="/notes" element={<NotesPage />} />
        <Route path="/notes/:noteId" element={<NotesPage />} />
        <Route path="/about" element={<About />} />
        <Route path="*" element={<NoPageFound />} />
      </Routes>
    </div>
  );
}

export default App;
