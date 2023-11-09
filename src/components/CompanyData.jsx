import React, { useContext, useEffect, useRef, useState } from "react";
import {
  Button,
  Checkbox,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import { Container } from "@mui/system";
import axios from "axios";
import { ResearchContext } from "../global/context/ContextProvider";

const CompanyData = () => {
  // context values
  const {
    clientId,
    qc1,
    fromDate,
    dateNow,
    companies,
    company,
    showTableData,
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
  const fetchTableData = async () => {
    try {
      const request_data = {
        client_id: clientId,
        company_id: companyId,
        qc1by: qc1,
        from_datetime: fromDate,
        to_datetime: dateNow,
      };

      const url = "http://51.68.220.77:8000/listArticlebyQC/";

      const response = await axios.post(url, request_data, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response) {
        setTableData(response.data.feed_data);
        const localeV = response.data.feed_data;
        setTableHeaders(Object.keys(localeV[0]));
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
      ? setCompanyId(companyIds.map((item) => `'${item}'`).join(","))
      : setCompanyId([]);
  }, [companies, company]);
  // effect for the setting data for the editing row data basis on dropdown selection
  useEffect(() => {
    const editRowValues = selectedRowData
      .map((item) => item[editRow])
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
    // Check if any rows are selected
    if (selectedRowData.length > 0) {
      const updatedRowsData = selectedRowData.map((selectedRow) => {
        const rowIndex = tableData.findIndex((row) => row === selectedRow);

        if (rowIndex !== -1) {
          return {
            ...selectedRow,
            [editRow]: editValue,
          };
        }

        return null;
      });

      setUpadatedRows((prevUpdatedRows) => [
        ...prevUpdatedRows,
        ...updatedRowsData,
      ]);

      setTableData((prevTableData) => {
        const updatedTableData = [...prevTableData];

        // Loop through selected rows and update the "editrow" field
        updatedRowsData.forEach((updatedRow) => {
          const rowIndex = updatedTableData.findIndex(
            (row) => row === updatedRow
          );

          if (rowIndex !== -1) {
            updatedTableData[rowIndex] = updatedRow;
          }
        });

        return updatedTableData;
      });
    }
  };

  const handleSort = () => {
    const sortedData = [...tableData];
    sortedData.sort((a, b) => {
      const authorNameA = (a.publication || "").toLowerCase();
      const authorNameB = (b.publication || "").toLowerCase();
      return authorNameA.localeCompare(authorNameB);
    });
    setTableData(sortedData);
  };
  const handlePostData = async () => {
    const dt = updatedRows.map((row) => {
      return {
        // "SOCIALFEEDID": 18150502887,
        // "COMPANYID": "ARC", this two columns are mandatory  and 1 or more         "KEYWORD": "Updated Keyword 1",
        // "REPORTINGTONE": 2,
        // "REPORTINGSUBJECT": "Updated Reporting Subject 1",
        // "SUBCATEGORY": "Updated Subcategory 1",
        // "PROMINENCE": 1.6,
        // "DETAILSUMMARY": "Updated Detail Summary 1"
      };
    });
    console.log(dt);
    try {
      const url = "http://51.68.220.77:8000/update2database/";
      await axios.post(url, {});
    } catch (error) {
      console.log(error);
    }
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
            {tableHeaders.map((header, index) => (
              <TableCell
                key={header}
                style={{
                  backgroundColor: index % 2 === 1 ? "lightgray" : "white",
                  maxHeight: "50px",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {rowData[header]}
              </TableCell>
            ))}
          </TableRow>
        ))
    ) : (
      <p className="text-red-500 w-screen text-center">No data found.</p>
    );
  };

  return (
    <div style={{ position: "relative" }}>
      {/* filters for editing the cells */}
      <Container sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
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
        <Button variant="contained">Save</Button>
      </Container>
      {/* sort Functionality */}
      <Container sx={{ width: "100%", textAlign: "right" }}>
        <span className="font-bold cursor-pointer" onClick={handleSort}>
          Sort A to Z
        </span>
      </Container>
      {/* main table */}
      <div>
        <table>
          <thead>
            <tr className="sticky top-0 bg-slate-400">
              {showTableData && (
                <tr>
                  <Checkbox
                    checked={selectedRowData.length === tableData.length}
                    onChange={handleMasterCheckboxChange}
                  />
                </tr>
              )}

              {showTableData &&
                tableHeaders.map((headers) => (
                  <TableCell key={headers}>{headers}</TableCell>
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
