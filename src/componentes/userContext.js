import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userRespostas, setUserRespostas] = useState({});

  const updateUser = (newUserId) => {
    setUserId(newUserId);
  };

  const updateUserRespostas = (questaoNumero, resposta) => {
    setUserRespostas((prevrespostas) => ({
      ...prevrespostas,
      [questaoNumero]: resposta,
    }));
  };

  return (
    <UserContext.Provider value={{ userId, updateUser, userRespostas, updateUserRespostas }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('Tem que usar dentro do UserProvider');
  }
  return context;
};