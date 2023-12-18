import { createContext, useContext, useState } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [userId, setUserId] = useState(null);
  const [userResponses, setUserResponses] = useState({});

  const updateUser = (newUserId) => {
    setUserId(newUserId);
  };

  const updateUserResponses = (questionNumber, response) => {
    setUserResponses((prevResponses) => ({
      ...prevResponses,
      [questionNumber]: response,
    }));
  };

  return (
    <UserContext.Provider value={{ userId, updateUser, userResponses, updateUserResponses }}>
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