import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const ResearchContext = createContext(null);
const ContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState("");
  const [clients, setClients] = useState([]);
  const fetchCompanyData = async () => {
    try {
      const result = await axios.get("http://51.68.220.77:8000/clientlist/");
      if (result.data) {
        setClients(result.data.clients);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchCompanyData();
  }, []);

  return (
    <ResearchContext.Provider value={{ setUserToken, userToken, clients }}>
      {children}
    </ResearchContext.Provider>
  );
};

export default ContextProvider;
