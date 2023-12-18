import React, { useState, useEffect } from 'react';
import { IoMdHome } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import '../estilos/styles.css';
import 'katex/dist/katex.min.css';
import {  BlockMath } from 'react-katex';
import Gabarito from './gabaritoQuestoes';
import { IoLogOutOutline } from "react-icons/io5";



const PaginaQuestao1 = () => {
  const navigate = useNavigate();
  const [respostaSelecionada, setRespostaSelecionada] = useState('');
  const [pontuacao, setPontuacao] = useState(0);
  const [respostaCorreta] = useState('A'); //resposta correta é a A (1)
  const [respostaSalva, setRespostaSalva] = useState('');
  const location = useLocation();
  const userId = location.state?.userId;
  const [locationKey, setLocationKey] = useState(0);
  const [tempoRestante, setTempoRestante] = useState(160 * 60); //2 horas e 40 minutos em segundos

  //console.log('ID do usuário na página de questão 1:', userId);



  const matrizQuestao1 = () => {
    //exibição da matriz
    const matrizLatex = 'A =\\begin{bmatrix} 0 & 2 & 0 & 2 & 2 \\\\ 0 & 0 & 2 & 1 & 0 \\\\ 1 & 2 & 0 & 1 & 1 \\\\ 0 & 2 & 2 & 0 & 0 \\\\ 3 & 0 & 1 & 1 & 0 \\end{bmatrix}';
  
    return (
      <div>
        
        <BlockMath math={matrizLatex} />
      </div>
    );
  };
  
  useEffect(() => {
    const checkUserId = async () => {
      try {
        //console.log('Tentando verificar usuário com ID:', userId);

      if (userId) {
        try {
          const response = await axios.get(`http://localhost:4000/usuarios/${userId}`);
          //console.log('Resposta da verificação do usuário:', response.data);
          const existingUser = response.data;

          if (!existingUser) {
            //console.log('Usuário não encontrado. Redirecionando para a página de login.');
            navigate('/');
          }
        } catch (error) {
          console.error('Erro ao verificar usuário:', error);
        }
      } else {
        //console.log('ID do usuário não definido. Redirecionando para a página de login.');
        navigate('/');
      }
            } catch (error) {
              console.error('Erro ao verificar usuário:', error);
            }
          };
        
          checkUserId();
        }, [userId, navigate]);
    
        useEffect(() => {
          const interval = setInterval(() => {
            setTempoRestante((prevTempo) => (prevTempo > 0 ? prevTempo - 1 : 0));
          }, 1000);
      
          return () => clearInterval(interval);
        }, []);

  const handleSelecionarResposta = (opcao) => {
    setRespostaSelecionada(opcao);
  };

  const handleSalvarResposta = async () => {
    try {
      //calcula a pontuação
      const pontuacaoAtual = respostaSelecionada === respostaCorreta ? 105.8 : 0;
      setPontuacao(pontuacaoAtual);
  
      //obtém as respostas do banco de dados
      const response = await axios.get(`http://localhost:4000/usuarios/${userId}`);
      const usuarioExistente = response.data;
  
      if (usuarioExistente) {
        //verifica se o usuário já respondeu a esta pergunta
        const indiceRespostaExistente = usuarioExistente.respostas.findIndex(
          (resposta) => resposta.questao === 1
        );
  
        if (indiceRespostaExistente !== -1) {
          //atualiza a resposta existente
          usuarioExistente.respostas[indiceRespostaExistente] = {
            questao: 1,
            resposta: respostaSelecionada,
            pontuacao: pontuacaoAtual,
          };
        } else {
          //adiciona uma nova resposta
          usuarioExistente.respostas.push({
            questao: 1,
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
  
        //navega para a próxima questão, passando o ID do usuário junto.
        navigate('/questao2', { state: { userId, tempoRestante: tempoRestante - 1 } });
        setLocationKey((prevKey) => prevKey + 1);
      } 
    } catch (error) {
      console.error('Erro ao salvar resposta:', error);
    }
  };
  
  const handleRevisarDepois = async () => {
    try {
      //verificar se o ID do usuário está definido
      if (!userId) {
        //console.log('ID do usuário não definido. Redirecionando para a página de login.');
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
          (resposta) => resposta.questao === 1
        );
  
        if (indiceRespostaExistente === -1) {
          //se o usuário ainda não respondeu à pergunta, adicionar uma nova resposta
          usuarioExistente.respostas.push({
            questao: 1,
            resposta: '', //string vazia, pois está marcada para revisão posterior
            pontuacao: 0,
          });
  
          //atualizar o banco de dados com a nova resposta
          await axios.patch(`http://localhost:4000/usuarios/${userId}`, {
            respostas: usuarioExistente.respostas,
          });
  
          //navegar para a próxima pergunta
          navigate('/questao2', { state: { userId } });
          setLocationKey((prevKey) => prevKey + 1);
        } else {
          //se o usuário já respondeu à pergunta, simplesmente navegar para a próxima pergunta
          alert('Resposta marcada como branca, pulando para próxima questão...');
          setRespostaSelecionada('');
          navigate('/questao2', { state: { userId } });
        }
      }
    } catch (error) {
      console.error('Erro ao revisar depois:', error);
    }
  };

  const formatarTempo = (segundos) => {
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segundosRestantes = segundos % 60;
  
    return `${horas}h ${minutos}m ${segundosRestantes}s`;
  };
  

  return (
    <div className='page-container'>
      <header className='questao-header'>
        <div className='header-left'>
          <Link to="/">
            <IoMdHome size={24} />
          </Link>
          <h1>Questão 1</h1>
        </div>
        <div className='header-right'>
          <span>Prova: Matemática e suas tecnologias</span>
        </div>
        <span>Tempo restante: {formatarTempo(tempoRestante)}</span>
      </header>

        
        <div>
          <p>
          A Transferência Eletrônica Disponível (TED) é uma transação financeira de valores entre diferentes bancos. Um economista decide analisar os valores enviados por meio de TEDs entre cinco bancos (1,2, 3, 4 e 5) durante um mês. Para isso, ele dispõe esses valores em uma matriz A = [aij], em que 1 ≤ 5 e 1 ≤ j ≤ 5, e o elemento aij corresponde ao total proveniente das operações feitas via TED, em milhão de real, transferidos do banco i para o banco j durante o mês. Observe que os elementos aij = 0, uma vez que TED é uma transferência entre bancos distintos. Esta é a matriz obtida para essa análise:
          </p>
        </div>
        <div className='matriz-container'> 
          {matrizQuestao1()}
          
        </div>

        <div className='opcoes-container'>
        <h6>Com base nessas informações, o banco que transferiu a maior quantia via TED é o banco:</h6>
        </div>

        <div className="opcoes-lista opcoes-esquerda">
          <ul>
          <br></br>
          <br></br>
          <li>
            <label>
              A<input
                type="radio"
                name="opcao"
                value="A"
                checked={respostaSelecionada === 'A'}
                onChange={() => handleSelecionarResposta('A')}
              />
              1
            </label>
          </li>
          <br></br>
          <li>
            <label>
              B<input
                type="radio"
                name="opcao"
                value="B"
                checked={respostaSelecionada === 'B'}
                onChange={() => handleSelecionarResposta('B')}
              />
              2
            </label>
          </li>
          <br></br>
          <li>
            <label>
              C<input
                type="radio"
                name="opcao"
                value="C"
                checked={respostaSelecionada === 'C'}
                onChange={() => handleSelecionarResposta('C')}
              />
              3
            </label>
          </li>
          <br></br>
          <li>
            <label>
              D<input
                type="radio"
                name="opcao"
                value="D"
                checked={respostaSelecionada === 'D'}
                onChange={() => handleSelecionarResposta('D')}
              />
              4
            </label>
          </li>
          </ul>
        </div>
        
      
      <div className='botoes-container'>
          <button onClick={handleRevisarDepois}>Revisar Depois</button>
          <button onClick={handleSalvarResposta}>Salvar</button>
          
        </div>
        <button
          onClick={() => navigate('/')}
          style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '16px'}}
        >
          Sair <IoLogOutOutline />
        </button>
        
    </div>
  );
};



export default PaginaQuestao1;