import React, { createContext, useState } from "react";

export const ResearchContext = createContext(null);
const ContextProvider = ({ children }) => {
  const [userToken, setUserToken] = useState("");
  // clientId for the fetching company
  const [clientId, setClientId] = useState("");
  // company setting when getting clientId from the clients
  const [company, setCompany] = useState([]);
  // selected compnies
  const [companies, setCompanies] = useState([]);
  // data type separate
  const [dateType, setDateType] = useState([]);
  // qc by defaut it will be null
  const [qc1, setQc1] = useState(null);
  // dates
  const [fromDate, setFromDate] = useState(null);
  const [dateNow, setDateNow] = useState(null);
  // dates end
  const [showTableData, setShowTableData] = useState(false);
  //languages
  const [language, setLanguage] = useState([]);
  // selecting continent
  const [continent, setContinent] = useState("");
  // basis onn the selection of the continent showing th country
  const [country, setCountry] = useState([]);

  return (
    <ResearchContext.Provider
      value={{
        setUserToken,
        userToken,
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
        dateType,
        setDateType,
        language,
        setLanguage,
        continent,
        setContinent,
        country,
        setCountry,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};

export default ContextProvider;
