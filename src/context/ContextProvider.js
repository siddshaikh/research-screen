import React, { createContext, useEffect, useState } from "react";

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
  // qc2
  const [qc2, setQc2] = useState(null);
  // image
  const [isImage, setIsImage] = useState(false);
  // video
  const [isvideo, setIsVideo] = useState(false);
  // dates
  const [fromDate, setFromDate] = useState(
    new Date().toISOString().slice(0, 16)
  );
  useEffect(() => {
    const fromDateObject = new Date(fromDate);
    const tomorrow = new Date(fromDateObject);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextdayIsoString = tomorrow.toISOString().slice(0, 16);
    setDateNow(nextdayIsoString);
  }, [fromDate]);
  const [dateNow, setDateNow] = useState("");
  // dates end
  const [showTableData, setShowTableData] = useState(false);
  //languages
  const [language, setLanguage] = useState([]);
  // selecting continent
  const [continent, setContinent] = useState([]);
  // basis onn the selection of the continent showing th country
  const [country, setCountry] = useState([]);
  //companyID for getting an a tableData
  const [companyId, setCompanyId] = useState([]);

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
        qc2,
        setQc2,
        isImage,
        setIsImage,
        isvideo,
        setIsVideo,
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
        companyId,
        setCompanyId,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};

export default ContextProvider;
