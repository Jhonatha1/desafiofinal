import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../estilos/styles.css';
import axios from 'axios';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

//adicionar questão de verificação se usuário já existe no db.json

  const handleLogin = async () => {
    if (name && email) {
      try {
        await axios.post('http://localhost:4000/usuarios', {
          name,
          email,
        });
        navigate('/questao1');
      } catch (error) {
        console.error('Erro ao enviar dados para a API:', error);
      }
    } else {
      alert('Por favor, preencha todos os campos.');
    }
  };

  return (
    <div className="login-container">
      <h1><center>INICIAR SIMULADO</center></h1>
      <label>
        Nome:
        <input type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br></br>
      <br></br>
      <label>
        Email:
        <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br></br>
      <br></br>
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
};

export default Login;
