import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../estilos/styles.css';
import { useLocation, Link } from 'react-router-dom';


const Gabarito = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const userId = location.state?.userId;
  const [userAnswers, setUserAnswers] = useState(null);

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

  const handleSalvarRespostas = () => {
      navigate('/ranking', { state: { userId } });
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
                    <button onClick={() => handleMudarResposta(answer.questao)}>
                      Mudar Resposta
                    </button>
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
