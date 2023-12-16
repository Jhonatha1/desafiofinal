import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './componentes/paginaInicial';
import PaginaQuestao1 from './componentes/paginaQuestao1';
import PaginaQuestao2 from './componentes/paginaQuestao2';
import { UserProvider } from './componentes/userContext';

const App = () => {
  return (
    <UserProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/questao1" element={<PaginaQuestao1 />} />
          <Route path="/questao2" element={<PaginaQuestao2 />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
