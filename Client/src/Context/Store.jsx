import React, { useState, useEffect } from "react";
import UserContext from "./UserContext";

const UserContextProvider = ({ children }) => {

  // Load from localStorage on first render
  const [auth, setAuth] = useState(() => {
    return JSON.parse(localStorage.getItem("auth")) || false;
  });

  const [role, setRole] = useState(() => {
    return localStorage.getItem("role") || "";
  });

  const [user , setUser] = useState({});
  const [moviename , setMoviename] = useState('') ;

  // Whenever auth or role changes, update localStorage
  useEffect(() => {
    // if(auth === false) return ;
    console.log("Hey bro , i am running , i am here -> ...") ;
    localStorage.setItem("auth", JSON.stringify(auth));
    localStorage.setItem("role", role);
  }, [auth, role]);

  return (
    <UserContext.Provider value={{ auth, setAuth, role, setRole, user, setUser , moviename , setMoviename }}>
      {children}
    </UserContext.Provider>
  );
};

export default UserContextProvider;
