import React, { createContext, useEffect, useState } from "react";

export const ResearchContext = createContext(null);
const ContextProvider = ({ children }) => {
  //state for the login component
  const [name, setName] = useState("");
  const [userToken, setUserToken] = useState("");
  // for logout timer
  const [timerId, setTimerId] = useState(null);
  // clientId for the fetching company
  const [clientId, setClientId] = useState("");
  // company setting when getting clientId from the clients
  const [company, setCompany] = useState([]);
  // selected compnies
  const [companies, setCompanies] = useState([]);
  // loading state while fetching tableData
  const [companyId, setCompanyId] = useState([]);
  // fetching table data using client and companyid and multiple params
  const [tableData, setTableData] = useState([]);
  const [tableFetchLoading, setTableFetchLoading] = useState(false);
  // table headers in uppercase
  const [tableHeaders, setTableHeaders] = useState([]);

  // data type separate
  const [dateType, setDateType] = useState("article");
  // qc by defaut it will be null
  const [qc1done, setQc1done] = useState(0);
  // qc2done
  const [qc2done, setQc2done] = useState(0);
  // qc1by
  const [qc1by, setQc1by] = useState([]);
  // qc2by
  const [qc2by, setQc2by] = useState([]);
  // image
  const [isImage, setIsImage] = useState(1);
  // video
  const [isVideo, setIsVideo] = useState(0);
  // search text
  const [searchValue, setSearchValue] = useState("");
  // dates
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, "0");
  const day = String(currentDate.getDate()).padStart(2, "0");
  const hours = String(currentDate.getHours()).padStart(2, "0");
  const minutes = String(currentDate.getMinutes()).padStart(2, "0");
  const seconds = String(currentDate.getSeconds()).padStart(2, "0");

  const formattedDate = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;

  const [fromDate, setFromDate] = useState(formattedDate);

  const [dateNow, setDateNow] = useState("");

  useEffect(() => {
    const fromDateObject = new Date(fromDate);
    const nextDay = new Date(fromDateObject);
    nextDay.setDate(nextDay.getDate() + 2);
    nextDay.setHours(23, 59, 59, 999);
    const toDateStringFormatted = nextDay
      .toISOString()
      .slice(0, 19)
      .replace("T", " ");

    setDateNow(toDateStringFormatted);
  }, [fromDate]);

  // dates end
  const [showTableData, setShowTableData] = useState(false);
  //languages
  const [language, setLanguage] = useState([]);
  // selecting continent
  const [continent, setContinent] = useState([]);
  // basis onn the selection of the continent showing th country
  const [country, setCountry] = useState([]);
  // if user forgot the save the data after apply changes in  table
  const [unsavedChanges, setUnsavedChanges] = useState(false);

  return (
    <ResearchContext.Provider
      value={{
        name,
        setName,
        setUserToken,
        userToken,
        timerId,
        setTimerId,
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
        qc1by,
        setQc1by,
        qc2by,
        setQc2by,
        isImage,
        setIsImage,
        isVideo,
        setIsVideo,
        searchValue,
        setSearchValue,
        tableFetchLoading,
        setTableFetchLoading,
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
        tableData,
        setTableData,
        tableHeaders,
        setTableHeaders,
        // data saved or not
        unsavedChanges,
        setUnsavedChanges,
      }}
    >
      {children}
    </ResearchContext.Provider>
  );
};

export default ContextProvider;
