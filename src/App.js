import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Login from './componentes/paginaInicial';
import PaginaQuestao1 from './componentes/paginaQuestao1';
import PaginaQuestao2 from './componentes/paginaQuestao2';
import PaginaQuestao3 from './componentes/paginaQuestao3';
import PaginaQuestao4 from './componentes/paginaQuestao4';
import Gabarito from './componentes/gabaritoQuestoes';
import Ranking from './componentes/rankingGlobal';
import { UserProvider } from './componentes/userContext';
import axios from 'axios';
import { useState, useEffect } from 'react';

const App = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:4000/usuarios');
        setUsuarios(response.data);
      } catch (error) {
        console.error('Erro ao buscar usuários:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <UserProvider> 
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/questao1" element={<PaginaQuestao1 />} />
          <Route path="/questao2" element={<PaginaQuestao2 />} />
          <Route path="/questao3" element={<PaginaQuestao3 />} />
          <Route path="/questao4" element={<PaginaQuestao4 />} />
          <Route path="/gabarito" element={<Gabarito />} />
          <Route path="/ranking" element={<Ranking usuarios={usuarios} />} />
        </Routes>
      </Router>
    </UserProvider>
  );
};

export default App;
