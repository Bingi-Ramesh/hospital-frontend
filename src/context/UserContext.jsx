import React, { createContext, useContext, useState } from 'react';

// Create Context for User
const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => useContext(UserContext);

// Provider component to wrap around your app and provide the context
export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);

  // Set user data in context
  const setUserProfile = (userData) => {
    setUser(userData);
    localStorage.setItem('user', JSON.stringify(userData)); // Persist user data
  };

  // Clear user data from context
  const logout = () => {
    setUser(null);
    localStorage.removeItem('user'); // Clear localStorage
  };

  return (
    <UserContext.Provider value={{ user, setUserProfile, logout }}>
      {children}
    </UserContext.Provider>
  );
};
