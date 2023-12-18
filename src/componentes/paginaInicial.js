import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const Login = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const navigate = useNavigate();

  const [userId, setUserId] = useState(null); //novo estado para armazenar o ID do usuário

  const checkUserExists = async (email) => {
    try {
      const response = await axios.get(`http://localhost:4000/usuarios?email=${email}`);
      const existingUser = response.data[0];
      return existingUser;
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      return null;
    }
  };

  const handleLogin = async () => {
    if (name.trim() !== '' && email.trim() !== '') {
      try {
        const existingUser = await checkUserExists(email);

        if (existingUser) {
          //se o usuário já existe, use o ID existente
          console.log('Usuário já existe. ID:', existingUser.id);
          setUserId(existingUser.id); //armazena o ID do usuário no estado
          navigate('/questao1', { state: { userId: existingUser.id }, replace: true });
        } else {
          //se o usuário não existe, cria um novo usuário e obtém o ID
          const response = await axios.post('http://localhost:4000/usuarios', {
            name,
            email,
            respostas: [],
          });
          const newUser = response.data;
          const newUserId = newUser.id;
          setUserId(newUserId); //armazena o ID do novo usuário no estado
        
          //navega para a próxima página (por exemplo, questão 1) com o ID do novo usuário
          console.log('Novo usuário criado. ID:', newUserId);
          navigate('/questao1', { state: { userId: newUserId }, replace: true });
        }
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
        <input id="name" type="text" value={name} onChange={(e) => setName(e.target.value)} />
      </label>
      <br></br>
      <br></br>
      <label>
        Email:
        <input id="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
      </label>
      <br></br>
      <br></br>
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
};

export default Login;
