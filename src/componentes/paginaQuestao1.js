import React, { useState } from 'react';
import { IoMdHome } from 'react-icons/io';
import { Link } from 'react-router-dom';
import axios from 'axios';
import '../estilos/styles.css';

const PaginaQuestao1 = () => {
  const [respostaSelecionada, setRespostaSelecionada] = useState('');
  const [pontuacao, setPontuacao] = useState(0);
  const [respostaCorreta] = useState('A'); //resposta correta é a A (1)
  const [respostaSalva, setRespostaSalva] = useState('');

  const handleSelecionarResposta = (opcao) => {
    setRespostaSelecionada(opcao);
  };

  const handleSalvarResposta = async () => {
    try {
      //salva a resposta no state local
      setRespostaSalva(respostaSelecionada);
  
      //calcular pontuação
      const pontuacaoAtual = respostaSelecionada === respostaCorreta ? 100 : 0;
      setPontuacao(pontuacaoAtual);
  
      //obtém as respostas do banco de dados
      const response = await axios.get('http://localhost:4000/respostas');
      const respostas = response.data;
  
      //adiciona a nova resposta ao array de respostas
      respostas.push({
        id: respostas.length + 1,
        resposta: respostaSelecionada,
        pontuacao: pontuacaoAtual,
      });
  
      //atualiza o banco de dados com as novas respostas
      await axios.post('http://localhost:4000/respostas', { respostas });
    } catch (error) {
      console.error('Erro ao salvar resposta:', error);
    }
  };

  const handleRevisarDepois = () => {
    //dps adicionar
    alert('Revisar Depois');
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
            <span>Prova: Matemática e suas tecnologias </span>
            <span>Tempo: 1m.20s</span>
          </div>
        </header>

        
        <div className='questao-content'>
          <p>
          A Transferência Eletrônica Disponível (TED) é uma transação financeira de valores entre diferentes bancos. Um economista decide analisar os valores enviados por meio de TEDs entre cinco bancos (1,2, 3, 4 e 5) durante um mês. Para isso, ele dispõe esses valores em uma matriz A = [aij], em que 1 ≤ 5 e 1 ≤ j ≤ 5, e o elemento aij corresponde ao total proveniente das operações feitas via TED, em milhão de real, transferidos do banco i para o banco j durante o mês. Observe que os elementos aij = 0, uma vez que TED é uma transferência entre bancos distintos. Esta é a matriz obtida para essa análise:
          </p>
        </div>
        //adicionar imagem da questão sem utilizar o src aqui.
        <div className='opcoes-container'>
        <h6>Com base nessas informações, o banco que transferiu a maior quantia via TED é o banco:</h6>
        <ul>
          <li>
            <label>
              <input
                type="radio"
                name="opcao"
                value="A"
                checked={respostaSelecionada === 'A'}
                onChange={() => handleSelecionarResposta('A')}
              />
              1
            </label>
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
              2
            </label>
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
              3
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
              4
            </label>
          </li>
        </ul>
        
      </div>
      <div className='botoes-container'>
          <button onClick={handleRevisarDepois}>Revisar Depois</button>
          <button onClick={handleSalvarResposta}>Salvar</button>
        </div>
    </div>
  );
};



export default PaginaQuestao1;