import React, { useContext, useEffect, useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TableCell,
  TableRow,
  TextField,
  Typography,
  Tooltip,
} from "@mui/material";
import { Container } from "@mui/system";
import axios from "axios";
import { ResearchContext } from "../context/ContextProvider";
import useFetchData from "../hooks/useFetchData";

const CompanyData = () => {
  // context values
  const {
    name,
    userToken,
    clientId,
    qc1done,
    qc2done,
    isImage,
    isVideo,
    fromDate,
    dateNow,
    companies,
    company,
    showTableData,
    dateType,
    setShowTableData,
    continent,
    country,
    language,
  } = useContext(ResearchContext);

  // state variables for posting data to database
  const [currentDateWithTime, setCurrentDateWithTime] = useState("");
  const [postingLoading, setPostingLoading] = useState(false);
  //  varibale for the fetching the data convert array to string
  const [langsTostring, setLangsToString] = useState("");
  const [continentsTostring, setContinentsToString] = useState("");
  const [countriesToString, setCountriesToString] = useState("");

  // variable for the tableData
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");
  const [tableHeaders, setTableHeaders] = useState();
  const [companyId, setCompanyId] = useState([]);
  // dropdown items (for editing/updating row values)
  const [editRow, setEditRow] = useState("");
  // selectedRowData
  const [selectedRowData, setSelectedRowData] = useState([]);
  // search values from the table
  const [searchValue, setSearchValue] = useState("");
  const [searchedData, setSearchedData] = useState([]);
  // data for the edit
  const [editValue, setEditValue] = useState("");
  // Function to fetch table data
  // updatedrows
  const [updatedRows, setUpadatedRows] = useState([]);
  // saved success
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // showing tooltip when hover the table cell
  // sotrting
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortColumn, setSortColumn] = useState("");
  // dropdown fetch
  const url = process.env.REACT_APP_BASE_URL;
  // reporting tone
  const [reportingTones, setReportingTones] = useState([]);
  const [reportingTone, setReportingTone] = useState("");
  const { data: reportingTons } = useFetchData(`${url}reportingtonelist`);
  useEffect(() => {
    if (reportingTons.data) {
      setReportingTones(reportingTons.data.reportingtones_list);
    }
  }, [reportingTons]);
  // prominence
  const [prominences, setProminences] = useState([]);
  const [prominence, setProminence] = useState("");
  const { data: prominenceLists } = useFetchData(`${url}prominencelist`);
  useEffect(() => {
    if (prominenceLists.data) {
      setProminences(prominenceLists.data.prominence_list);
    }
  }, [prominenceLists]);
  //reportingsubject_list
  const [subjects, setSubjects] = useState([]);
  const [subject, setSubject] = useState("");
  const { data: subjectLists } = useFetchData(`${url}reportingsubjectlist`);
  useEffect(() => {
    if (subjectLists.data) {
      setSubjects(subjectLists.data.reportingsubject_list);
    }
  }, [subjectLists]);
  //subcategory_list
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const { data: categoryLists } = useFetchData(`${url}subcategorylist`);
  useEffect(() => {
    if (categoryLists.data) {
      setCategories(categoryLists.data.subcategory_list);
    }
  }, [categoryLists]);

  // converting array to the string as a backend requirement
  const arrayToString = (arr) => {
    if (Array.isArray(arr)) {
      if (arr.length > 1) {
        return arr.map((item) => `'${item}'`).join(",");
      } else {
        return `'${arr[0]}'`;
      }
    } else {
      return `${arr}`;
    }
  };
  useEffect(() => {
    const langsV = arrayToString(language);
    const continentV = arrayToString(continent);
    const countriesV = arrayToString(country);
    setLangsToString(langsV);
    setContinentsToString(continentV);
    setCountriesToString(countriesV);
  }, [language, continent, country]);
  // fetching data basis on the client and company selection
  const fetchTableData = async () => {
    // converting array to string fromat
    if (companies.length > 0) {
      try {
        const request_data = {
          client_id: clientId,
          company_id: companyId,
          date_type: dateType,
          // qc1_by: "qc1_user",
          // qc2_by: "qc2_user",
          is_qc1: qc1done,
          is_qc2: qc2done,
          from_datetime: fromDate,
          to_datetime: dateNow,
          has_image: isImage,
          has_video: isVideo,
          search_text: "",
          continent: continentsTostring,
          country: countriesToString,
          language: langsTostring,
        };

        const url = "http://51.68.220.77:8000/listArticlebyQC/";

        const response = await axios.post(url, request_data, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userToken,
          },
        });
        if (response) {
          const updatedData = response.data.feed_data.map((item) => {
            return {
              ...item,
              link: (
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Link
                </a>
              ),
            };
          });

          setTableData(updatedData);
          const localeV = response.data.feed_data;
          setTableHeaders(
            Object.keys(localeV[0]).map((header) =>
              header.toUpperCase().replace(/_/g, " ")
            )
          );
        }
      } catch (err) {
        setError(err.message);
        console.log(error);
      }
    }
  };

  useEffect(() => {
    fetchTableData();
    setShowTableData(false);
  }, [companyId, continentsTostring, countriesToString, langsTostring]);
  // Function to find company id based on selection
  const getCompanyId = (companyData, companyNames) => {
    let companyId = [];
    if (companyNames) {
      for (let i = 0; i < companyNames.length; i++) {
        const companyName = companyNames[i];
        const company = companyData.find(
          (item) => item.companyname === companyName
        );
        if (company) {
          companyId.push(company.companyid);
        } else {
          companyId.push(null);
        }
      }
    } else {
      return null;
    }
    return companyId;
  };

  useEffect(() => {
    const companyIds = getCompanyId(company, companies);
    companyIds
      ? setCompanyId(companyIds?.map((item) => `'${item}'`).join(","))
      : setCompanyId([]);
  }, [companies, company, companyId]);
  // effect for the setting data for the editing row data basis on dropdown selection
  useEffect(() => {
    const editRowValues = selectedRowData
      ?.map((item) => item[editRow])
      .filter((value) => value !== undefined);
    setEditValue(editRowValues ? editRowValues.join(" ") : "");
  }, [selectedRowData, editRow]);

  // Function to handle the selection of a row
  const handleRowSelect = (rowData) => {
    setSelectedRowData((prevSelectedRows) => {
      const isSelected = prevSelectedRows.some((row) => row === rowData);

      if (isSelected) {
        return prevSelectedRows.filter((row) => row !== rowData);
      } else {
        if (searchedData.length > 0) {
          // Check if the selected row is within the searched data
          if (searchedData.includes(rowData)) {
            return [...prevSelectedRows, rowData];
          }
        } else {
          return [...prevSelectedRows, rowData];
        }
      }
      return prevSelectedRows;
    });
  };
  const handleMasterCheckboxChange = () => {
    const allSelected = selectedRowData.length === tableData.length;

    if (searchedData.length > 0) {
      setSelectedRowData(allSelected ? [] : [...searchedData]);
    } else {
      setSelectedRowData(allSelected ? [] : [...tableData]);
    }
  };

  const handleSort = (clickedHeader) => {
    if (sortColumn === clickedHeader) {
      // Toggle sort direction if the same column is clicked
      setSortDirection((prevSortDirection) =>
        prevSortDirection === "asc" ? "desc" : "asc"
      );
    } else {
      // Set the new column to sort and reset the direction to ascending
      setSortColumn(clickedHeader);
      setSortDirection("asc");
    }
  };
  const applySort = () => {
    const sortedData = [...tableData];
    sortedData.sort((a, b) => {
      const valueA = (a[sortColumn] || "").toString().toLowerCase();
      const valueB = (b[sortColumn] || "").toString().toLowerCase();

      if (!isNaN(valueA) && !isNaN(valueB)) {
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      } else {
        const comparison = valueA.localeCompare(valueB);
        return sortDirection === "asc" ? comparison : -comparison;
      }
    });

    setTableData(sortedData);
  };

  useEffect(() => {
    applySort();
  }, [sortColumn, sortDirection]);

  // handle Search Table Values
  const handleSearch = () => {
    if (searchValue.trim() === "") {
      setSearchedData([]);
      return;
    }

    const output = tableData.filter((rowData) => {
      for (const key in rowData) {
        if (Object.prototype.hasOwnProperty.call(rowData, key)) {
          const value = rowData[key];
          if (
            value !== null &&
            value.toString().toLowerCase().includes(searchValue.toLowerCase())
          ) {
            return true;
          }
        }
      }
      return false;
    });

    setSearchedData(output);
  };

  //updating tabledata
  const handleApplyChanges = () => {
    if (selectedRowData.length > 0) {
      const updatedSelectedRows = selectedRowData.map((row) => ({
        ...row,
        reporting_tone: reportingTone || row.reporting_tone,
        reporting_subject: subject || row.reporting_subject,
        subcategory: category || row.subcategory,
        prominence: prominence || row.prominence,
        detail_summary: editValue || row.detail_summary,
      }));

      const updatedTableData = tableData.map((row) => {
        const updatedRow = updatedSelectedRows.find(
          (selectedRow) => selectedRow.social_feed_id === row.social_feed_id
        );
        return updatedRow || row;
      });

      setUpadatedRows(updatedSelectedRows);
      setTableData(updatedTableData);
    }
  };

  // getting current date with time
  useEffect(() => {
    const dateNow = new Date();
    const formattedDate = dateNow.toISOString().slice(0, 19).replace("T", " ");
    setCurrentDateWithTime(formattedDate);
  }, []);

  //posting updated tabledata to database
  const handlePostData = async () => {
    setSavedSuccess(true);
    setPostingLoading(true);

    // Check if companyId is a single string and format accordingly
    const formattedCompanyId = Array.isArray(companyId)
      ? companyId.map((item) => `'${item}'`).join(",")
      : companyId.replace(/'/g, "");

    const dataToSend = updatedRows.map((row) => ({
      COMPANYID: formattedCompanyId,
      DETAILSUMMARY: row.detail_summary,
      KEYWORD: "",
      MODIFIEDBY: name,
      MODIFIEDON: currentDateWithTime,
      PROMINENCE: row.prominence,
      REPORTINGSUBJECT: row.reporting_subject,
      REPORTINGTONE: row.reporting_tone,
      SOCIALFEEDID: row.social_feed_id,
      SUBCATEGORY: row.subcategory,
    }));

    try {
      const url = "http://51.68.220.77:8000/update2database/";
      if (dataToSend.length > 0) {
        await axios.post(url, dataToSend, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + userToken,
          },
        });
        setUpadatedRows([]);
        setPostingLoading(false);
        setSuccessMessage("Data updated successfully!");
        setSelectedRowData([]);
        // Clearing the dropdown values
        setReportingTone("");
        setSubject("");
        setCategory("");
        setProminence("");
      } else {
        setSuccessMessage("No data to save.");
        setPostingLoading(false);
      }
    } catch (error) {
      if (error.message === "Network Error") {
        setSuccessMessage("Please check your internet connection.");
        setPostingLoading(false);
      }
    }
  };

  // showing success or failure message for the limited time
  useEffect(() => {
    if (savedSuccess) {
      const timeoutId = setTimeout(() => {
        setSavedSuccess(false);
        setSuccessMessage("");
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [savedSuccess]);
  const highlightSearch = (text) => {
    if (!text || !searchValue.trim()) {
      return text;
    }

    if (typeof text === "string") {
      if (text.startsWith("<a") && text.endsWith("</a>")) {
        return text;
      }

      const regex = new RegExp(`(${searchValue})`, "gi");
      const parts = text.split(regex);

      return parts.map((part, index) =>
        regex.test(part) ? (
          <span key={index} style={{ backgroundColor: "yellow" }}>
            {part}
          </span>
        ) : (
          part
        )
      );
    }

    return text;
  };

  const renderTableData = () => {
    const dataToRender = searchedData.length > 0 ? searchedData : tableData;

    return tableData.length && showTableData ? (
      dataToRender.map((rowData, rowIndex) => (
        <TableRow key={rowIndex}>
          <TableCell>
            <Checkbox
              checked={selectedRowData.includes(rowData)}
              onChange={() => handleRowSelect(rowData)}
            />
          </TableCell>

          {tableHeaders?.map((header) => (
            <React.Fragment key={header}>
              {(header === "HEADLINE" ||
                header === "REPORTING SUBJECT" ||
                header === "DETAIL SUMMARY") && (
                <Tooltip
                  title={rowData[header.toLowerCase().replace(/ /g, "_")]}
                  placement="top"
                  enterDelay={500}
                  leaveDelay={200}
                >
                  <TableCell className="table-cell">
                    <div className="h-14 overflow-hidden">
                      {highlightSearch(
                        rowData[header.toLowerCase().replace(/ /g, "_")]
                      )}
                    </div>
                  </TableCell>
                </Tooltip>
              )}
              {header !== "HEADLINE" &&
                header !== "REPORTING SUBJECT" &&
                header !== "DETAIL SUMMARY" && (
                  <TableCell className="table-cell">
                    <div className="h-14 overflow-hidden">
                      {highlightSearch(
                        rowData[header.toLowerCase().replace(/ /g, "_")]
                      )}
                    </div>
                  </TableCell>
                )}
            </React.Fragment>
          ))}
        </TableRow>
      ))
    ) : (
      <p className="text-red-500 w-screen text-center">No data found.</p>
    );
  };

  return (
    <div
      style={{
        position: "relative",
      }}
    >
      {/* filters for editing the cells */}
      <Container
        sx={{
          display: "flex",
          justifyContent: "space-evenly",
          alignItems: "center",
          gap: 3,
        }}
      >
        <Container sx={{ display: "flex", alignItems: "center", gap: 3 }}>
          {/* searchfield for the searching tableData */}
          <TextField
            placeholder="Find Text"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ style: { height: "30px", fontSize: "0.8em" } }}
            InputProps={{
              sx: {
                height: "30px",
                "&:before": { borderBottom: "none" },
                "&:after": { borderBottom: "none" },
              },
            }}
          />
          <Button
            onClick={handleSearch}
            sx={{
              height: 30,
              fontSize: "0.8em",
              backgroundColor: "gray",
              color: "#fff",
            }}
          >
            Find
          </Button>
        </Container>

        {/* dropdowns for separating the files */}
        {/* reporting tone */}
        <FormControl sx={{ width: "15rem" }}>
          <InputLabel sx={{ fontSize: "0.8rem", margin: "-7px" }}>
            Tone
          </InputLabel>
          <Select
            label="Reporting Tone"
            sx={{ height: 30, fontSize: "0.8em" }}
            value={reportingTone}
            onChange={(e) => setReportingTone(e.target.value)}
          >
            <TextField
              value={reportingTone}
              onChange={(e) => setReportingTone(e.target.value)}
            />
            {reportingTones.map((item) => (
              <MenuItem value={item.value} key={item.value}>
                {item.tonality}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Prominence */}
        <FormControl sx={{ width: "15rem" }}>
          <InputLabel sx={{ fontSize: "0.8rem", margin: "-7px" }}>
            Prominence
          </InputLabel>
          <Select
            label="Prominence"
            sx={{ height: 30, fontSize: "0.8em" }}
            value={prominence}
            onChange={(e) => setProminence(e.target.value)}
          >
            {prominences.map((item) => (
              <MenuItem value={item} key={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Reporting subject */}
        <FormControl sx={{ width: "15rem" }}>
          <InputLabel sx={{ fontSize: "0.8rem", margin: "-7px" }}>
            Subject
          </InputLabel>
          <Select
            label="Reporting Subject"
            sx={{ height: 30, fontSize: "0.8em" }}
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
          >
            {subjects.map((item) => (
              <MenuItem key={item} value={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/*category */}
        <FormControl sx={{ width: "15rem" }}>
          <InputLabel sx={{ fontSize: "0.8rem", margin: "-7px" }}>
            Category
          </InputLabel>
          <Select
            label="Category"
            sx={{ height: 30, fontSize: "0.8em" }}
            value={category}
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((item) => (
              <MenuItem value={item} key={item}>
                {item}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        {/* Details summary */}
        <FormControl sx={{ width: "15rem" }}>
          <InputLabel sx={{ fontSize: "0.8rem", margin: "-7px" }}>
            Select Row
          </InputLabel>
          <Select
            value={editValue}
            onChange={(e) => setEditRow(e.target.value)}
            label="Select Row"
            sx={{ height: 30, fontSize: "0.8em" }}
          >
            <MenuItem value="detail_summary">Summary</MenuItem>
          </Select>
        </FormControl>
      </Container>
      <div className="mt-2 flex items-center justify-center gap-4">
        {" "}
        <div>
          <TextField
            value={editValue}
            onChange={(e) => setEditValue(e.target.value)}
            InputLabelProps={{ shrink: true }}
            inputProps={{ style: { height: "30px", fontSize: "0.8em" } }}
            InputProps={{
              sx: {
                width: 400,
                height: "30px",
                "&:before": { borderBottom: "none" },
                "&:after": { borderBottom: "none" },
              },
            }}
          />
          <Button
            variant="outlined"
            onClick={handleApplyChanges}
            sx={{ height: 30, fontSize: "0.8em", ml: 2 }}
          >
            Apply
          </Button>
          <Button
            variant="contained"
            onClick={handlePostData}
            sx={{ height: 30, fontSize: "0.8em", ml: 2 }}
          >
            {postingLoading ? "Loading..." : "Save"}
          </Button>
        </div>
        {/* saved or not */}
        <div className="w-1/3">
          {savedSuccess && (
            <Typography sx={{ color: "green" }}>{successMessage}</Typography>
          )}
        </div>
      </div>

      {/* main table */}
      <div className="mt-4">
        <table>
          <thead>
            <tr className="sticky top-0 bg-slate-400">
              {showTableData && (
                <TableCell>
                  <Checkbox
                    checked={selectedRowData.length === tableData.length}
                    onChange={handleMasterCheckboxChange}
                  />
                </TableCell>
              )}

              {showTableData &&
                tableHeaders?.map((header) => (
                  <TableCell
                    key={header}
                    onClick={() =>
                      handleSort(header.toLowerCase().replace(/ /g, "_"))
                    }
                    sx={{ cursor: "pointer" }}
                  >
                    {header}
                  </TableCell>
                ))}
            </tr>
          </thead>

          <tbody>{renderTableData()}</tbody>
        </table>
      </div>
    </div>
  );
};

export default CompanyData;
