// src/App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './componentes/paginaInicial';
import PaginaQuestao1 from './componentes/paginaQuestao1';

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/questao1" element={<PaginaQuestao1 />} />
      </Routes>
    </Router>
  );
};

export default App;
