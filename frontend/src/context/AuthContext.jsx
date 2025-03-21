/* 
Purpose:
This file manages authentication across the app.
It allows us to store the logged-in user and their JWT token.
Any component can access authentication status.

*/

import { createContext, useState, useEffect } from "react"; 
{ /* 
- We import createContext from React so we can create a global authentication state.
- useState is used to store the current user (logged in or not).
- useEffect helps us check if a user is already logged in when the page reloads. */ }

const AuthContext = createContext();

// ✅ Create provider component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    if (storedUser) {
      setUser(storedUser);
    }
  }, []);

  // Function to log in a user (this should be updated based on your API)
  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  // Function to log out a user
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;