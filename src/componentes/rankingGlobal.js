import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { FaUserSecret } from "react-icons/fa6";
import { useLocation } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

const Ranking = ({  usuarios }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [rankingData, setRankingData] = useState([]);
  const tempoTotal = 2 * 60 * 60 + 40 * 60; //2 horas e 40 minutos em segundos
  const tempoRestanteInicial = location.state?.tempoRestante || 0;
  const [tempoRestante, setTempoRestante] = useState(tempoRestanteInicial);
  const userId = location.state?.userId;



  useEffect(() => {
    const interval = setInterval(() => {
      setTempoRestante((prevTempo) => (prevTempo > 0 ? prevTempo - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, []); 
  

  useEffect(() => {
    if (usuarios && usuarios.length > 0) {
      const ranking = usuarios
        .map((usuario) => ({
          name: usuario.name,
          userId: usuario.id,
          pontuacao: usuario.pontuacao,
          tempo: usuario.tempo,
        }))
        .sort((a, b) => b.pontuacao - a.pontuacao);

      setRankingData(ranking);
    }
  }, [usuarios]);

  const formatarTempo = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;

    return `${horas}h ${minutos}m ${segundosRestantes}s`;
  };

  return (
    <div className='ranking-header'>
      <div>
        <h2>Ranking</h2>

        <table className='ranking-table'>
          <thead>
            <tr>
              <th></th>
              <th>Posição</th>
              <th>Nome</th>
              <th>ID</th>
              <th>Nota</th>
              <th>Tempo</th>
            </tr>
          </thead>
          <tbody>
          {rankingData.map((user, index) => (
    <tr key={index}>
        <td><FaUserSecret /></td>
        <td>{index + 1}</td>
        <td>{user.name}</td>
        <td>{user.userId}</td>
        <td>{user.pontuacao}pts</td>
        <td>
        {userId === user.userId ? formatarTempo(user.tempo) : formatarTempo(user.tempo)}


        </td>
      </tr>
      ))}
  
</tbody>
        </table>
        <Link to="/">
          <center>
            <button className='botao-voltar'>Voltar para o início</button>
          </center>
        </Link>
      </div>
    </div>
  );
};

export default Ranking;
