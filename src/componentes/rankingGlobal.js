import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Ranking = ({ userId, usuarios }) => {
  const [rankingData, setRankingData] = useState([]);

  useEffect(() => {
    if (usuarios && usuarios.length > 0) {
      const ranking = usuarios
        .map((usuario) => ({
          name: usuario.name,
          userId: usuario.id,
          pontuacao: usuario.pontuacao,
        }))
        .sort((a, b) => b.pontuacao - a.pontuacao);

      setRankingData(ranking);
    }
  }, [usuarios]);

  //renderizar apenas se houver usuários
  if (!usuarios || usuarios.length === 0) {
    return <p>Carregando usuários...</p>;
  }

  return (
    <div className='ranking-header'>
      <div>
        <h2>Ranking</h2>

        <table className='ranking-table'>
          <thead>
            <tr>
              <th>Posição</th>
              <th>Nome</th>
              <th>ID</th>
              <th>Nota</th>
            </tr>
          </thead>
          <tbody>
            {rankingData.map((user, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>{user.name}</td>
                <td>{user.userId}</td>
                <td>{user.pontuacao}</td>
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
