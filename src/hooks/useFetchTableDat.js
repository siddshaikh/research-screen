import React, { useContext, useEffect, useState } from "react";
import { ResearchContext } from "../context/ContextProvider";
import axios from "axios";

const useFetchTableDat = () => {
  const {
    userToken,
    clientId,
    companyId,
    dateType,
    qc1,
    fromDate,
    dateNow,
    continent,
    country,
    language,
    companies,
  } = useContext(ResearchContext);
  console.log(companies);
  const [tableData, setTableData] = useState([]);
  const [tableHeaders, setTableHeaders] = useState([]);

  const fetchTableData = async () => {
    try {
      const request_data = {
        client_id: clientId,
        company_id: companyId,
        date_type: dateType,
        qc1by: qc1,
        from_datetime: fromDate,
        to_datetime: dateNow,
        // search_text: "",
        // continent: continent,
        // country: country,
        // language: language,
      };
      const url = "http://51.68.220.77:8000/listArticlebyQC/";
      const response = axios.post(url, request_data, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + userToken,
        },
      });
      if (response) {
        setTableData(response.data.feed_data);
        const localeV = response.data.feed_data;
        setTableHeaders(
          Object.keys(localeV[0]).map((header) =>
            header.toUpperCase().replace(/_/g, " ")
          )
        );
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchTableData();
  }, []);
  return <div>useFetchTableDat</div>;
};

export default useFetchTableDat;
