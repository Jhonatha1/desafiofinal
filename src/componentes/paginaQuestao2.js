import React, { useState, useEffect } from 'react';
import { IoMdHome } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../estilos/styles.css';
import { useUser } from './userContext';
import {  BlockMath } from 'react-katex';


const PaginaQuestao2 = () => {
  const navigate = useNavigate();
  const [respostaSelecionada, setRespostaSelecionada] = useState('');
  const [pontuacao, setPontuacao] = useState(0);
  const [respostaCorreta] = useState('B'); //resposta correta é a A (1)
  const [respostaSalva, setRespostaSalva] = useState('');
  const location = useLocation();
  const userId = location.state?.userId;
  const [locationKey, setLocationKey] = useState(0);
  console.log('ID do usuário na página de questão 2:', userId);
   
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
    
  
    const handleSelecionarResposta = (opcao) => {
      setRespostaSelecionada(opcao);
    };
  
    const handleSalvarResposta = async () => {
      try {
        //calcula a pontuação
        const pontuacaoAtual = respostaSelecionada === respostaCorreta ? 100 : 0;
        setPontuacao(pontuacaoAtual);
    
        //obtém as respostas do banco de dados
        const response = await axios.get(`http://localhost:4000/usuarios/${userId}`);
        const usuarioExistente = response.data;
    
        if (usuarioExistente) {
          //verifica se o usuário já respondeu a esta pergunta
          const indiceRespostaExistente = usuarioExistente.respostas.findIndex(
            (resposta) => resposta.questao === 2
          );
    
          if (indiceRespostaExistente !== -1) {
            //atualiza a resposta existente
            usuarioExistente.respostas[indiceRespostaExistente] = {
              questao: 2,
              resposta: respostaSelecionada,
              pontuacao: pontuacaoAtual,
            };
          } else {
            //adiciona uma nova resposta
            usuarioExistente.respostas.push({
              questao: 2,
              resposta: respostaSelecionada,
              pontuacao: pontuacaoAtual,
            });
          }
    
          //atualiza o banco de dados com as respostas novas/atualizadas
          await axios.patch(`http://localhost:4000/usuarios/${userId}`, {
            respostas: usuarioExistente.respostas,
          });
    
          //salva a resposta no estado local
          setRespostaSalva(respostaSelecionada);
    
          //navega para a próxima questão, passando o id do usuário junto.
          navigate('/questao3', { state: { userId } });
        }
      } catch (error) {
        console.error('Erro ao salvar resposta:', error);
      }
    };

    const handleRevisarDepois = async () => {
      try {
        //verificar se o ID do usuário está definido
        if (!userId) {
          console.log('ID do usuário não definido. Redirecionando para a página de login.');
          navigate('/');
          return;
        }
    
        //obter dados do usuário do banco de dados
        const response = await axios.get(`http://localhost:4000/usuarios/${userId}`);
        const usuarioExistente = response.data;
    
        //verificar se o usuário existe
        if (usuarioExistente) {
          //verificar se o usuário já respondeu à pergunta atual
          const indiceRespostaExistente = usuarioExistente.respostas.findIndex(
            (resposta) => resposta.questao === 2
          );
    
          if (indiceRespostaExistente === -1) {
            //se o usuário ainda não respondeu à pergunta, adicionar uma nova resposta
            usuarioExistente.respostas.push({
              questao: 2,
              resposta: '', //string vazia, pois está marcada para revisão posterior
              pontuacao: 0,
            });
    
            //atualizar o banco de dados com a nova resposta
            await axios.patch(`http://localhost:4000/usuarios/${userId}`, {
              respostas: usuarioExistente.respostas,
            });
    
            //navegar para a próxima pergunta
            navigate('/questao3', { state: { userId } });
            setLocationKey((prevKey) => prevKey + 1);
          } else {
            //se o usuário já respondeu à pergunta, simplesmente navegar para a próxima pergunta
            alert('Resposta marcada como branca, pulando para próxima questão...');
            setRespostaSelecionada('');
            navigate('/questao3', { state: { userId } });
          }
        }
      } catch (error) {
        console.error('Erro ao revisar depois:', error);
      }
    };

  const TabelaQuestao2 = () => {
    const disciplinas = ['Matemática', 'Português', 'Geografia', 'História'];
    const bimestres = ['', '1º Bimestre', '2º Bimestre', '3º Bimestre', '4º Bimestre'];
  
    const notas = {
      'Matemática': [5.9, 6.2, 4.5, 5.5],
      'Português': [6.6, 7.1, 6.5, 8.4],
      'Geografia': [8.6, 6.8, 7.8, 9.0],
      'História': [6.2, 5.6, 5.9, 7.7],
    };
  
    const renderizarCelulas = () => {
      const celulas = [];
  
      //renderiza a primeira linha com os rótulos dos bimestres
      const rotulosBimestres = bimestres.map((rotulo, index) => (
        <th key={`bimestre-${index}`}>{rotulo}</th>
      ));
      celulas.push(<tr key="rotulos-bimestres">{rotulosBimestres}</tr>);
  
      //renderiza as demais linhas com os rótulos das disciplinas e as notas
      disciplinas.forEach((disciplina, i) => {
        const linha = [<td key={`disciplina-${i}`}>{disciplina}</td>];
  
        for (let j = 0; j < 4; j++) {
          linha.push(<td key={`nota-${i}-${j + 1}`}>{notas[disciplina][j]}</td>);
        }
  
        celulas.push(<tr key={`linha-${i}`}>{linha}</tr>);
      });
  
      return celulas;
    };
  
    return (
      <table border="1">
        <tbody>{renderizarCelulas()}</tbody>
      </table>
    );
  };

  const MatrizLetraA = () => {
    //exibição da matriz da letra A
    const matrizLatex = '\\begin{bmatrix} \\frac{1}{2} & \\frac{1}{2} & \\frac{1}{2} & \\frac{1}{2} \\end{bmatrix}';
  
    return (
      <div>
        <BlockMath math={matrizLatex} />
      </div>
    );
  };

  const MatrizLetraB = () => {
    //exibição da matriz da letra B
    const matrizLatex = '\\begin{bmatrix} \\frac{1}{4} & \\frac{1}{4} & \\frac{1}{4} & \\frac{1}{4} \\end{bmatrix}';
  
    return (
      <div>
        <BlockMath math={matrizLatex} />
      </div>
    );
  };

  const MatrizLetraC = () => {
    //exibição da matriz da letra C
    const matrizLatex = '\\begin{bmatrix} \ 1 \\\\ \\\\ \ 1 \\\\ \\\\ \ 1 \\\\ \\\\ \ 1 \\end{bmatrix}';
  
    return (
      <div>
        <BlockMath math={matrizLatex} />
      </div>
    );
  };

  const MatrizLetraD = () => {
    //exibição da matriz da letra D
    const matrizLatex = '\\begin{bmatrix} \\frac{1}{2} \\\\ \\\\ \\frac{1}{2} \\\\ \\\\ \\frac{1}{2} \\\\ \\\\ \\frac{1}{2} \\end{bmatrix}';
  
    return (
      <div>
        <BlockMath math={matrizLatex} />
      </div>
    );
  };

  
  const MatrizLetraE = () => {
    //exibição da matriz da letra E
    const matrizLatex = '\\begin{bmatrix} \\frac{1}{4} \\\\ \\\\ \\frac{1}{4} \\\\ \\\\ \\frac{1}{4} \\\\ \\\\ \\frac{1}{4} \\end{bmatrix}';
  
    return (
      <div>
        <BlockMath math={matrizLatex} />
      </div>
    );
  };
  
  return (
    <div className='page-container'>
      <header className='questao-header'>
        <div className='header-left'>
          <Link to="/">
            <IoMdHome size={24} />
          </Link>
          <h1>Questão 2</h1>
          </div>
          <div className='header-right'>
            <span>Prova: Matemática e suas tecnologias </span>
            <span>Tempo: 1m.20s</span>
          </div>
        </header>

        
        <div className='questao-content'>
          <p>
          Um aluno registrou as notas bimestrais de algumas de suas disciplinas numa tabela. Ele observou que as entradas numéricas da tabela formavam uma matriz 4x4, e que poderia calcular as médias anuais dessas disciplinas usando produto de matrizes. Todas as provas possuíam o mesmo peso, e a tabela que ele conseguiu é mostrada a seguir.
          </p>
        </div>
       <div className='tabela-container'>
        <TabelaQuestao2 />
        </div>

        <div className='opcoes-container'>
        <h6>Para obter essas médias, ele multiplicou a matriz obtida a partir da tabela por</h6>

        <div className="opcoes-lista">
          <ul>
          <br></br>
          <br></br>
          <li>
            <label>
              <input
                type="radio"
                name="opcao"
                value="A"
                checked={respostaSelecionada === 'A'}
                onChange={() => handleSelecionarResposta('A')}
              />
              A <MatrizLetraA />
            </label>
          </li>
          <br></br>
          <li>
            <label>
              <input
                type="radio"
                name="opcao"
                value="B"
                checked={respostaSelecionada === 'B'}
                onChange={() => handleSelecionarResposta('B')}
              />
              B <MatrizLetraB />
            </label>
          </li>
          <br></br>
          <li>
            <label>
              <input
                type="radio"
                name="opcao"
                value="C"
                checked={respostaSelecionada === 'C'}
                onChange={() => handleSelecionarResposta('C')}
              />
              C <MatrizLetraC />

            </label>
          </li>
          <li>
            <label>
              <input
                type="radio"
                name="opcao"
                value="D"
                checked={respostaSelecionada === 'D'}
                onChange={() => handleSelecionarResposta('D')}
              />
              D <MatrizLetraD />

            </label>
          </li>
          <li>
            <label>
              <input
                type="radio"
                name="opcao"
                value="E"
                checked={respostaSelecionada === 'E'}
                onChange={() => handleSelecionarResposta('E')}
              />
              E <MatrizLetraE />

            </label>
          </li>
        </ul>
        </div>
        
      </div>
      <div className='botoes-container'>
          <button onClick={handleRevisarDepois}>Revisar Depois</button>
          <button onClick={handleSalvarResposta}>Salvar</button>
        </div>
    </div>
  );
};



export default PaginaQuestao2;