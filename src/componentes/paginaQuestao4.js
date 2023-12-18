import React, { useState, useEffect } from 'react';
import { IoMdHome } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../estilos/styles.css';
import { useUser } from './userContext';
import { useLocation } from 'react-router-dom';




const PaginaQuestao4 = () => {
  const navigate = useNavigate();
  const [respostaSelecionada, setRespostaSelecionada] = useState('');
  const [pontuacao, setPontuacao] = useState(0);
  const [respostaCorreta] = useState('D'); //resposta correta é a A (1)
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
            (resposta) => resposta.questao === 4
          );
    
          if (indiceRespostaExistente !== -1) {
            //atualiza a resposta existente
            usuarioExistente.respostas[indiceRespostaExistente] = {
              questao: 4,
              resposta: respostaSelecionada,
              pontuacao: pontuacaoAtual,
            };
          } else {
            //adiciona uma nova resposta
            usuarioExistente.respostas.push({
              questao: 4,
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
    
          //navega para o gabarito, passando o id do usuário junto.
          navigate('/gabarito', { state: { userId } });
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
            (resposta) => resposta.questao === 4
          );
    
          if (indiceRespostaExistente === -1) {
            //se o usuário ainda não respondeu à pergunta, adicionar uma nova resposta
            usuarioExistente.respostas.push({
              questao: 4,
              resposta: '', //string vazia, pois está marcada para revisão posterior
              pontuacao: 0,
            });
    
            //atualizar o banco de dados com a nova resposta
            await axios.patch(`http://localhost:4000/usuarios/${userId}`, {
              respostas: usuarioExistente.respostas,
            });
    
            //navegar para o gabarito
            navigate('/gabarito', { state: { userId } });
            setLocationKey((prevKey) => prevKey + 1);
          } else {
            //se o usuário já respondeu à pergunta, simplesmente navegar para o gabarito
            alert('Resposta marcada como branca, pulando para próxima questão...');
            setRespostaSelecionada('');
            navigate('/gabarito', { state: { userId } });
          }
        }
      } catch (error) {
        console.error('Erro ao revisar depois:', error);
      }
    };

  const TabelaQuestao4 = () => {
    const disciplinas = ['I', 'II', 'III'];
    const bimestres = ['ANO', 'RECEITA(EM BILHÕES DE REAIS)'];
  
    const notas = {
        'I': ['2,2'],
        'II': ['4,2'],
        'III': ['7,4'],
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
  
        for (let j = 0; j < 1; j++) {
          linha.push(<td key={`nota-${i}-${j + 1}`}>{notas[disciplina][j]}</td>);
        }
  
        celulas.push(<tr key={`linha-${i}`}>{linha}</tr>);
      });
  
      return celulas;
    };
  
    return (
      <table border="4">
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
          <h1>Questão 4</h1>
          </div>
          <div className='header-right'>
            <span>Prova: Ciências da Natureza e suas tecnologias </span>
            <span>Tempo: 1m.20s</span>
          </div>
        </header>

        
        <div className='questao-content'>
          <p>
          Um gerente decidiu fazer um estudo financeiro da empresa onde trabalha analisando as receitas anuais dos três últimos anos. Tais receitas são apresentadas no quadro:
          </p>
        </div>
       <div className='tabela-container-questao3'>
        <TabelaQuestao4/>
        </div>
        

        <div className='questao-content'>
            <p>
            Estes dados serão utilizados para projetar a receita mínima esperada para o ano atual (ano IV). pois a receita esperada para o ano IV é obtida em função das variações das receitas anuais anteriores, utilizando a seguinte regra: a variação do ano IV para o ano III será igual à variação do ano III para o Il adicionada à média aritmética entre essa variação e a variação do ano Il para o I.
            </p>
        </div>

        <div className='opcoes-container'>
        <h6>O valor da receita mínima esperada, em bilhão de reais, será de:</h6>

        <div className="opcoes-lista">
          <ul>
          <br></br>
          <br></br>
          <li>
            <label>
                A
              <input
                type="radio"
                name="opcao"
                value="A"
                checked={respostaSelecionada === 'A'}
                onChange={() => handleSelecionarResposta('A')}
              />
          </label>
          10
          </li>
          <br></br>     
          <li>
            <label>
                B
              <input
                type="radio"
                name="opcao"
                value="B"
                checked={respostaSelecionada === 'B'}
                onChange={() => handleSelecionarResposta('B')}
              />
         </label>
         12
          </li>
          <br></br>
          <li>
            <label>
                C
              <input
                type="radio"
                name="opcao"
                value="C"
                checked={respostaSelecionada === 'C'}
                onChange={() => handleSelecionarResposta('C')}
              />
            </label>
            13,2
          </li>
          <br></br>
          <li>
            <label>
                D
              <input
                type="radio"
                name="opcao"
                value="D"
                checked={respostaSelecionada === 'D'}
                onChange={() => handleSelecionarResposta('D')}
              />
            </label>
            14,4
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



export default PaginaQuestao4;