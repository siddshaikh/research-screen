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
import { ResearchContext } from "../global/context/ContextProvider";

const CompanyData = () => {
  // context values
  const {
    userToken,
    clientId,
    qc1,
    fromDate,
    dateNow,
    companies,
    company,
    showTableData,
    dateType,
    continent,
    country,
    language,
  } = useContext(ResearchContext);
  // state variables
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");
  const [tableHeaders, setTableHeaders] = useState();
  const [companyId, setCompanyId] = useState([]);
  // dropdown items (for editing/updating row values)
  const [editRow, setEditRow] = useState("");
  // selectedRowData
  const [selectedRowData, setSelectedRowData] = useState([]);
  // data for the edit
  const [editValue, setEditValue] = useState("");
  // Function to fetch table data
  // updatedrows
  const [updatedRows, setUpadatedRows] = useState([]);
  // saved success
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  // showing tooltip when hover the table cell
  const [hoveredCellData, setHoveredCellData] = useState(null);
  // sotrting
  const [sortDirection, setSortDirection] = useState("asc");
  const [sortColumn, setSortColumn] = useState("");

  // fetching data basis on the client and company selection
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

      const response = await axios.post(url, request_data, {
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
    } catch (err) {
      setError(err.message);
      console.log(error);
    }
  };

  useEffect(() => {
    fetchTableData();
  }, [companyId, company]);

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
  }, [companies, company]);
  // effect for the setting data for the editing row data basis on dropdown selection
  useEffect(() => {
    const editRowValues = selectedRowData
      ?.map((item) => item[editRow])
      .filter((value) => value !== undefined);
    setEditValue(editRowValues ? editRowValues.join(" ") : "");
  }, [selectedRowData, editRow]);

  // Function to handle the selection of a row
  const handleRowSelect = (rowData) => {
    const isSelected = selectedRowData.includes(rowData);

    setSelectedRowData(
      isSelected
        ? selectedRowData.filter((data) => data !== rowData)
        : [...selectedRowData, rowData]
    );
  };

  const handleMasterCheckboxChange = () => {
    const allSelected = selectedRowData.length === tableData.length;

    setSelectedRowData(allSelected ? [] : [...tableData]);
  };

  const handleApplyChanges = () => {
    if (selectedRowData.length > 0) {
      setTableData((prevTableData) => {
        return prevTableData?.map((row) => {
          if (selectedRowData.includes(row)) {
            // Update only the selected rows
            return {
              ...row,
              [editRow]: editValue,
            };
          }
          return row;
        });
      });

      // Update the updatedRows state
      setUpadatedRows((prevUpdatedRows) => [
        ...prevUpdatedRows,
        ...selectedRowData?.map((selectedRow) => ({
          ...selectedRow,
          [editRow]: editValue,
        })),
      ]);
    }
  };

  const handleSort = (clickedHeader) => {
    if (sortColumn === clickedHeader.toLowerCase().replace(/ /g, "_")) {
      // Toggle sort direction if the same column is clicked
      setSortDirection((prevSortDirection) =>
        prevSortDirection === "asc" ? "desc" : "asc"
      );
    } else {
      setSortColumn(clickedHeader);
      setSortDirection("asc");
    }
  };
  const applySort = () => {
    const sortedData = [...tableData];
    sortedData.sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      console.log("Sorting:", valueA, valueB);

      if (typeof valueA === "string" && typeof valueB === "string") {
        // String comparison
        return sortDirection === "asc"
          ? valueA.localeCompare(valueB)
          : valueB.localeCompare(valueA);
      } else {
        // Numeric comparison
        return sortDirection === "asc" ? valueA - valueB : valueB - valueA;
      }
    });

    setTableData(sortedData);
  };

  useEffect(() => {
    applySort();
  }, []);
  const handlePostData = async () => {
    const data =
      updatedRows.length > 0 &&
      updatedRows?.map((row) => ({
        social_feed_id: row.social_feed_id,
        company_id: row.company_id,
        reporting_tone: row.reporting_tone,
        reporting_subject: row.reporting_subject,
        subcategory: row.subcategory,
        prominence: row.prominence,
        detail_summary: row.detail_summary,
      }));

    try {
      const url = "http://51.68.220.77:8000/update2database/";
      if (data.length > 0) {
        await axios.post(url, data, {
          headers: { "Content-Type": "application/json" },
        });
        setUpadatedRows([]);
        setSavedSuccess(true);
        setSuccessMessage("Data Saved Successfully!");
        setSelectedRowData([]);
      } else {
        setSuccessMessage("No data to save.");
      }
    } catch (error) {
      console.error("Error while saving data:", error);
    }
  };
  // showing success or failure message for the limited time
  useEffect(() => {
    if (savedSuccess) {
      const timeoutId = setTimeout(() => {
        setSavedSuccess(false);
      }, 3000);

      return () => clearTimeout(timeoutId);
    }
  }, [savedSuccess]);

  //showing cell data when hover on the cell

  const handleCellHover = (data) => {
    setHoveredCellData(data);
  };

  const handleCellLeave = () => {
    setHoveredCellData(null);
  };
  const renderTableData = () => {
    return showTableData ? (
      tableData.length > 0 &&
        tableData.map((rowData, rowIndex) => (
          <TableRow key={rowIndex}>
            <TableCell>
              <Checkbox
                checked={selectedRowData.includes(rowData)}
                onChange={() => handleRowSelect(rowData)}
              />
            </TableCell>
            {tableHeaders?.map((header) => (
              <Tooltip
                key={header}
                title={rowData[header]}
                placement="top"
                enterDelay={500}
                leaveDelay={200}
              >
                <TableCell
                  className="table-cell"
                  onMouseEnter={() =>
                    handleCellHover(
                      rowData[header.toLowerCase().replace(/ /g, "_")]
                    )
                  }
                  onMouseLeave={handleCellLeave}
                >
                  <div className="h-14 overflow-hidden">
                    {rowData[header.toLowerCase().replace(/ /g, "_")]}
                  </div>
                </TableCell>
              </Tooltip>
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
      <Container>
        {savedSuccess && (
          <Typography sx={{ color: "green" }}>{successMessage}</Typography>
        )}
      </Container>
      <Container sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
        {/* saved or not */}

        <FormControl sx={{ width: "15rem" }}>
          <InputLabel>Select Row</InputLabel>
          <Select
            value={editRow}
            onChange={(e) => setEditRow(e.target.value)}
            label="Select Row"
          >
            <MenuItem value={"reporting_tone"}>Reporting Tone</MenuItem>
            <MenuItem value={"reporting_subject"}>Reporting Subject</MenuItem>
            <MenuItem value={"subcategory"}>Sub Category</MenuItem>
            <MenuItem value={"prominence"}>Prominence</MenuItem>
            <MenuItem value={"detail_summary"}>Detail Summary</MenuItem>
          </Select>
        </FormControl>
        <TextField
          value={editValue}
          onChange={(e) => setEditValue(e.target.value)}
        />
        <Button variant="outlined" onClick={handleApplyChanges}>
          Apply
        </Button>
        <Button variant="contained" onClick={handlePostData}>
          Save
        </Button>
      </Container>

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
                    onClick={() => handleSort(header)}
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
