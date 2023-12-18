import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../estilos/styles.css';
import { useLocation, Link } from 'react-router-dom';
import Ranking from './rankingGlobal';  

const Gabarito = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const [userAnswers, setUserAnswers] = useState(null);
  const [rankingData, setRankingData] = useState([]);
  const API_URL = 'http://localhost:4000';
  const respostasCorretas = ['A', 'B', 'C', 'D'];

  useEffect(() => {
    const checkUserId = async () => {
      try {
        console.log('Tentando verificar usuário com ID:', userId);

        if (userId) {
          try {
            const response = await axios.get(`http://localhost:4000/usuarios/${userId}`);
            console.log('Resposta da verificação do usuário:', response.data);
            const existingUser = response.data;

            if (!existingUser) {
              console.log('Usuário não encontrado. Redirecionando para a página de login.');
              navigate('/');
            } else {
              console.log('Respostas do usuário:', existingUser.respostas);
              setUserAnswers(existingUser.respostas);
            }
          } catch (error) {
            console.error('Erro ao verificar usuário:', error);
          }
        } else {
          console.log('ID do usuário não definido. Redirecionando para a página de login.');
          navigate('/');
        }
      } catch (error) {
        console.error('Erro ao verificar usuário:', error);
      }
    };

    checkUserId();
  }, [userId, navigate]);

  const handleMudarResposta = (questao) => {
    //use o Link para navegar para a questão específica
    const linkDaQuestao = `/questao${questao}`;
    //navegue usando o Link e passando o userId como state
    navigate(linkDaQuestao, { state: { userId } });
  };

  const handleSalvarRespostas = async () => {
    try {
      const pontuacao = calcularPontuacao();
  
      if (userAnswers && userAnswers.length > 0) {
        const response = await axios.get(`${API_URL}/usuarios/${userId}`);
        const existingUser = response.data;
  
        if (existingUser && existingUser.id) {
          //atualizar apenas as propriedades necessárias
          const updatedUser = {
            ...existingUser,
            respostas: userAnswers,
            pontuacao,
          };
  
          //fazer uma requisição PUT para atualizar os dados no backend
          await axios.put(`${API_URL}/usuarios/${userId}`, updatedUser);
  
          const responseUsuarios = await axios.get(`${API_URL}/usuarios`);
          const usuarios = responseUsuarios.data;
  
          //atualizar o usuário específico
          const updatedUsers = usuarios.map(user =>
            user.id === updatedUser.id ? updatedUser : user
          );
  
          //adicionar dados ao estado local de rankingData
          const rankingData = updatedUsers.map(user => ({
            userId: user.id,
            name: user.name || '',
            pontuacao: user.pontuacao || 0,
          }));
  
          //ordenar dados por pontuação em ordem decrescente
          rankingData.sort((a, b) => b.pontuacao - a.pontuacao);
  
          setRankingData(rankingData);
  
          //navegar para a página /ranking
          navigate('/ranking', { state: { userId } });
        } else {
          console.error('Usuário não encontrado.');
        }
      } else {
        console.error('Nenhuma resposta encontrada para o usuário.');
      }
    } catch (error) {
      console.error('Erro ao salvar respostas:', error);
    }
  };
  

  const calcularPontuacao = () => {
    if (userAnswers) {
      return userAnswers.reduce((pontuacao, answer) => {
        //verifica se a resposta do usuário está correta
        const respostaCorreta = respostasCorretas[answer.questao - 1];
        if (answer.resposta === respostaCorreta) {
          //adiciona 100 pontos por cada resposta correta
          pontuacao += 100;
        }
        return pontuacao;
      }, 0);
    }
    return 0;
  };

  return (
    <div className='gabarito-header'>
      <h1>Gabarito</h1>

      <div className='gabarito-container'>
        {userAnswers && userAnswers.length > 0 ? (
          <table className='gabarito-table'>
            <thead>
              <tr>
                <th>Questão</th>
                <th>Resposta</th>
                <th>Prova</th>
                <th>Status</th>
                <th>Tempo</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {userAnswers.map((answer, index) => (
                <tr key={index}>
                  <td>{`${answer.questao}`}</td>
                  <td>{`${answer.resposta || 'Nenhuma alternativa marcada'}`}</td>
                  <td>
                    {answer.questao <= 2
                      ? "Matemática e suas Tecnologias"
                      : answer.questao === 3 || answer.questao === 4
                      ? "Ciências da Natureza e suas Tecnologias"
                      : 'N/A'}
                  </td>
                  <td>{answer.resposta ? 'Respondido' : 'Sem resposta'}</td>
                  <td>{/* Tempo  */}</td>
                  <td>
                    <div className='botao-revisar-respostas'>
                    <button onClick={() => handleMudarResposta(answer.questao)}>
                      Mudar Resposta
                    </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>Nenhuma resposta achada nesse usuário.</p>
        )}

<div className='botao-salvar-respostas'>
            <button onClick={handleSalvarRespostas}>Salvar Respostas</button>
          </div>
      </div>

    </div>
  );
};

export default Gabarito;
