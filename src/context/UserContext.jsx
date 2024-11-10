import { createContext, useState, useContext } from 'react';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState({});

  const handleUpdateUser = (user) => {
    console.log('HANDLE UPDATE:', user)
    setCurrentUser(user);
  };

  return (
    <UserContext.Provider value={{ currentUser, handleUpdateUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => {
  return useContext(UserContext);
};