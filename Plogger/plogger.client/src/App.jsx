import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import HomePage from './pages/HomePage'
import EditPipeline from './pages/Pipelines/EditPipeline'

import EntryList from './pages/Entries/EntryList'
import PostEntry from './pages/Entries/PostEntry'
import EditEntry from './pages/Entries/EditEntry'
import DeleteEntry from './pages/Entries/DeleteEntry'

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/login" element={<LoginPage />} />

                <Route path="/" element={<HomePage />} />
                <Route path="/pipelines/edit/:id" element={<EditPipeline />} />

                <Route path="/entries" element={<EntryList />} />
                <Route path="/entries/create" element={<PostEntry />} />
                <Route path="/entries/edit/:id" element={<EditEntry />} />
                <Route path="/entries/delete/:id" element={<DeleteEntry />} />
            </Routes>
        </Router>
    );
}

export default App;