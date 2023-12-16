import React, { useState, useEffect } from 'react';
import { IoMdHome } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import '../estilos/styles.css';
import { useUser } from './userContext';
import {  BlockMath } from 'react-katex';

const PaginaQuestao2 = () => {
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
            questao: 1,
          });
    
          //atualiza o banco de dados com as novas respostas
          await axios.post('http://localhost:4000/respostas', { respostas });
    
          //salva a resposta no estado local
          setRespostaSalva(respostaSelecionada);
    
          //use navigate para ir para a próxima questão
          
          navigate('/questao3');
        } catch (error) {
          console.error('Erro ao salvar resposta:', error);
        }
      };

  const handleRevisarDepois = () => {
    //dps adicionar
    alert('Revisar Depois');
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