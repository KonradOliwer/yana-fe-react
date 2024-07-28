import React from 'react';
import './App.css';
import UserTopBar from './notes/MainTopBar';
import NotesPage from './notes/NotesPage';
import { Navigate, Route, Routes } from 'react-router-dom';
import About from './about/About';
import { NoPageFound } from './Errors';
import './apiConfig';
import LoginPage from './auth/LoginPage';
import { AuthIsSignedIn, AuthIsSignedOut, AuthProvider } from './auth/UserDataProvider';

function App() {
  return (
    <div className="App">
      <AuthProvider>
        <UserTopBar />
        <AuthIsSignedIn>
          <Routes>
            <Route path="/" element={<Navigate to="/notes" />} />
            <Route path="/notes" element={<NotesPage />} />
            <Route path="/notes/:noteId" element={<NotesPage />} />
            <Route path="/about" element={<About />} />
            <Route path="*" element={<NoPageFound />} />
          </Routes>
        </AuthIsSignedIn>
        <AuthIsSignedOut>
          <Routes>
            <Route path="/about" element={<About />} />
            <Route path="*" element={<LoginPage />} />
          </Routes>
        </AuthIsSignedOut>
      </AuthProvider>
    </div>
  );
}

export default App;
