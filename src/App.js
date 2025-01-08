import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CricketersList from './components/CricketersList';
import PlayerDetails from './components/PlayerDetails';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<CricketersList />} />
        <Route path="/player/:id" element={<PlayerDetails />} />
      </Routes>
    </Router>
  );
};

export default App;