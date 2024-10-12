import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PipelineList from './components/PipelineList';
import './App.css';

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/pipelines" component={PipelineList} />
            </Routes>
        </Router>
    );
}

export default App;