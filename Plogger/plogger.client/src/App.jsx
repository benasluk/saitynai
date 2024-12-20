import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';

import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';

import HomePage from './pages/HomePage'
import EditPipeline from './pages/Pipelines/EditPipeline'
import CreatePipeline from './pages/Pipelines/CreatePipeline'
import DeletePipeline from './pages/Pipelines/DeletePipeline'

import LogList from './pages/Logs/LogList'
import EditLog from './pages/Logs/EditLog'
import CreateLog from './pages/Logs/CreateLog'
import DeleteLog from './pages/Logs/DeleteLog'

import EntryList from './pages/Entries/EntryList'
import PostEntry from './pages/Entries/PostEntry'
import EditEntry from './pages/Entries/EditEntry'
import DeleteEntry from './pages/Entries/DeleteEntry'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                <Route path="/" element={<HomePage />} />
                <Route path="/pipelines/create/" element={<CreatePipeline />} />
                <Route path="/pipelines/edit/:id" element={<EditPipeline />} />
                <Route path="/pipelines/delete/:id" element={<DeletePipeline />} />

                <Route path="/logs" element={<LogList />} />
                <Route path="/logs/create/" element={<CreateLog />} />
                <Route path="/logs/edit/:id" element={<EditLog />} />
                <Route path="/logs/delete/:id" element={<DeleteLog />} />

                <Route path="/entries" element={<EntryList />} />
                <Route path="/entries/create" element={<PostEntry />} />
                <Route path="/entries/edit/:id" element={<EditEntry />} />
                <Route path="/entries/delete/:id" element={<DeleteEntry />} />
            </Routes>
        </Router>
    );
}

export default App;