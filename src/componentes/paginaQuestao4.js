import React, { useState, useEffect } from 'react';
import { IoMdHome } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../estilos/styles.css';
import { useUser } from './userContext';


const PaginaQuestao4 = () => {
    const navigate = useNavigate();
    const { userId } = useUser(); 
  
    const [respostaSelecionada, setRespostaSelecionada] = useState('');
    const [pontuacao, setPontuacao] = useState(0);
    const [respostaCorreta] = useState('A');
    const [respostaSalva, setRespostaSalva] = useState('');
  
    const handleSelecionarResposta = (opcao) => {
      setRespostaSelecionada(opcao);
    };
  
    const handleSalvarResposta = async () => {
        try {
          //calcula pontuação
          const pontuacaoAtual = respostaSelecionada === respostaCorreta ? 100 : 0;
          setPontuacao(pontuacaoAtual);
    
          //obtém as respostas do banco de dados
          const response = await axios.get('http://localhost:4000/respostas');
          const respostas = response.data.respostas || [];
    
          //adiciona a nova resposta ao array de respostas
          respostas.push({
            resposta: respostaSelecionada,
            pontuacao: pontuacaoAtual,
            questao: 3,
          });
    
          //atualiza o banco de dados com as novas respostas
          await axios.post('http://localhost:4000/respostas', { respostas });
    
          //salva a resposta no estado local
          setRespostaSalva(respostaSelecionada);
    
          //use navigate para ir para a próxima questão
          
          navigate('/gabarito');
        } catch (error) {
          console.error('Erro ao salvar resposta:', error);
        }
      };

  const handleRevisarDepois = () => {
    //dps adicionar
    alert('Revisar Depois');
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