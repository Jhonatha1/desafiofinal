import React, { useState, useEffect } from 'react';
import { IoMdHome } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../estilos/styles.css';
import { useLocation } from 'react-router-dom';
import { useUser } from './userContext';
import { IoMdMale } from "react-icons/io";
import { IoMdFemale } from "react-icons/io";
import { FaSquareFull } from "react-icons/fa6";



const PaginaQuestao3 = () => {
  const navigate = useNavigate();
  const [respostaSelecionada, setRespostaSelecionada] = useState('');
  const [pontuacao, setPontuacao] = useState(0);
  const [respostaCorreta] = useState('C'); //resposta correta é a A (1)
  const [respostaSalva, setRespostaSalva] = useState('');
  const location = useLocation();
  const userId = location.state?.userId;
  const [locationKey, setLocationKey] = useState(0);
  console.log('ID do usuário na página de questão 3:', userId);
  

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
            (resposta) => resposta.questao === 3
          );
    
          if (indiceRespostaExistente !== -1) {
            //atualiza a resposta existente
            usuarioExistente.respostas[indiceRespostaExistente] = {
              questao: 3,
              resposta: respostaSelecionada,
              pontuacao: pontuacaoAtual,
            };
          } else {
            //adiciona uma nova resposta
            usuarioExistente.respostas.push({
              questao: 3,
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
          navigate('/questao4', { state: { userId } });
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
            (resposta) => resposta.questao === 3
          );
    
          if (indiceRespostaExistente === -1) {
            //se o usuário ainda não respondeu à pergunta, adicionar uma nova resposta
            usuarioExistente.respostas.push({
              questao: 3,
              resposta: '', //string vazia, pois está marcada para revisão posterior
              pontuacao: 0,
            });
    
            //atualizar o banco de dados com a nova resposta
            await axios.patch(`http://localhost:4000/usuarios/${userId}`, {
              respostas: usuarioExistente.respostas,
            });
    
            //navegar para a próxima pergunta
            navigate('/questao4', { state: { userId } });
            setLocationKey((prevKey) => prevKey + 1);
          } else {
            //se o usuário já respondeu à pergunta, simplesmente navegar para a próxima pergunta
            alert('Resposta marcada como branca, pulando para próxima questão...');
            setRespostaSelecionada('');
            navigate('/questao4', { state: { userId } });
          }
        }
      } catch (error) {
        console.error('Erro ao revisar depois:', error);
      }
    };

  const TabelaQuestao3 = () => {
    const disciplinas = ['', 'Alelo A', 'Alelo B', 'Alelo C', 'Alelo D'];
    const bimestres = ['',<IoMdMale/>,<IoMdFemale/>, '1', '2', '3', '4', '5', ] 
  
    const notas = {
      '':['','','','','','',''],
      'Alelo A': ['','','','','','','',''],
      'Alelo B': [<FaSquareFull/>,'',<FaSquareFull/>,<FaSquareFull/>,<FaSquareFull/>,<FaSquareFull/>,<FaSquareFull/>],
      'Alelo C': ['',<FaSquareFull/>,<FaSquareFull/>,'',<FaSquareFull/>,'',<FaSquareFull/>],
      'Alelo D': ['','','','','',<FaSquareFull/>,''],
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
  
        for (let j = 0; j < 7; j++) {
          linha.push(<td key={`nota-${i}-${j + 1}`}>{notas[disciplina][j]}</td>);
        }
  
        celulas.push(<tr key={`linha-${i}`}>{linha}</tr>);
      });
  
      return celulas;
    };
  
    return (
      <table border="0">
        <tbody>{renderizarCelulas()}</tbody>
      </table>
    );
  };

  const TabelaDoisQuestao3 = () => {
    const disciplinas = ['', 'Alelo E', 'Alelo F', 'Alelo G', 'Alelo H'];
    const bimestres = ['',<IoMdMale/>,<IoMdFemale/>, '1', '2', '3', '4', '5', ] 
  
    const notas = {
      '':['','','','','','',''],
      'Alelo E': [<FaSquareFull/>,'',<FaSquareFull/>,<FaSquareFull/>,'','',<FaSquareFull/>,''],
      'Alelo F': ['','','','','','','',''],
      'Alelo G': [<FaSquareFull/>,<FaSquareFull/>,<FaSquareFull/>,'',<FaSquareFull/>,<FaSquareFull/>,''],
      'Alelo H': ['','','','',<FaSquareFull/>,'',''],
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
  
        for (let j = 0; j < 7; j++) {
          linha.push(<td key={`nota-${i}-${j + 1}`}>{notas[disciplina][j]}</td>);
        }
  
        celulas.push(<tr key={`linha-${i}`}>{linha}</tr>);
      });
  
      return celulas;
    };
  
    return (
      <table border="0">
        <tbody>{renderizarCelulas()}</tbody>
      </table>
    );
  };

  
  
  return (
    <div className='page-container'>
      <header className='questao-header'>
        <div className='header-left'>
          <Link to="/">
            <IoMdHome size={24} />
          </Link>
          <h1>Questão 3</h1>
          </div>
          <div className='header-right'>
            <span>Prova: Ciências da Natureza e suas tecnologias </span>
            <span>Tempo: 1m.20s</span>
          </div>
        </header>

        
        <div className='questao-content'>
          <p>
          Um pesquisador observou, em uma árvore, um ninho de uma espécie de falcão. Apenas um filhote apresentava uma coloração típica de penas de ambos os pais. Foram coletadas amostras de DNA dos pais e filhotes para caracterização genética dos alelos responsáveis pela coloração das penas. O perfil de bandas obtido para cada indivíduo do ninho para os lócus 1 e 2, onde se localizam os genes dessa característica, está representado na figura.
          </p>
          <h5><b><center>Padrões de bandas em gel das moléculas de DNA dos indivíduos</center></b></h5>
        </div>
       <div className='tabela-container-questao3'>
        <TabelaQuestao3 />
        </div>
        <br></br><br></br>
        <div className='tabela-container-questao3'>
        <TabelaDoisQuestao3 />
        </div>

        <div className='opcoes-container'>
        <h6>Dos filhotes, qual apresenta a coloração típica de penas dos pais?</h6>

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
A            </label>
          </li>
          
          <li>
            <label>
              <input
                type="radio"
                name="opcao"
                value="B"
                checked={respostaSelecionada === 'B'}
                onChange={() => handleSelecionarResposta('B')}
              />
B            </label>
          </li>
          
          <li>
            <label>
              <input
                type="radio"
                name="opcao"
                value="C"
                checked={respostaSelecionada === 'C'}
                onChange={() => handleSelecionarResposta('C')}
              />
C
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
D
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



export default PaginaQuestao3;