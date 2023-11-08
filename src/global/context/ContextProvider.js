import axios from "axios";
import React, { createContext, useEffect, useState } from "react";

export const ResearchContext = createContext(null);
const ContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState("");
  const [clients, setClients] = useState([]);
  // clientId for the fetching company
  const [clientId, setClientId] = useState("");
  // company setting when getting clientId from the clients
  const [company, setCompany] = useState([]);
  // selected compnies
  const [companies, setCompanies] = useState([]);
  // qc by defaut it will be null
  const [qc1, setQc1] = useState(null);
  // dates
  const [fromDate, setFromDate] = useState(null);
  const [dateNow, setDateNow] = useState(null);
  // dates end
  const [showTableData, setShowTableData] = useState(false);

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
    <ResearchContext.Provider
      value={{
        setUserToken,
        userToken,
        clients,
        clientId,
        setClientId,
        company,
        setCompany,
        companies,
        setCompanies,
        fromDate,
        setFromDate,
        dateNow,
        setDateNow,
        qc1,
        setQc1,
        showTableData,
        setShowTableData,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};

export default ContextProvider;
