import React, { createContext, useEffect, useState } from "react";

export const ResearchContext = createContext(null);
const ContextProvider = ({ children }) => {
  //state for the login component
  const [name, setName] = useState("");
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
  const [qc1done, setQc1done] = useState(0);
  // qc2
  const [qc2done, setQc2done] = useState(0);
  // image
  const [isImage, setIsImage] = useState(1);
  // video
  const [isVideo, setIsVideo] = useState(0);
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
        name,
        setName,
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
        qc1done,
        setQc1done,
        qc2done,
        setQc2done,
        isImage,
        setIsImage,
        isVideo,
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
