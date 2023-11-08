import React, { useContext, useEffect, useState } from "react";
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
  const [singleValue, setSingleValue] = useState("");
  const [selectedRows, setSelectedRows] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [error, setError] = useState("");
  const [tableHeaders, setTableHeaders] = useState();
  const [companyId, setCompanyId] = useState([]);
  // ids of the selected rows
  const [rowId, setRowId] = useState([]);
  console.log("rowId", rowId);
  // dropdown items (for editing/updating row values)
  const [editRow, setEditRow] = useState("");
  console.log(editRow);
  // selectedRowData
  const [selectedRowData, setSelectedRowData] = useState([]);
  console.log(selectedRowData);
  // Function to fetch table data
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
  // finding matching values
  useEffect(() => {
    const rowIds = selectedRowData.map((item) => item.social_feed_id);
    setRowId(rowIds);
    const findMatchingValue = () => {
      const matchingData = selectedRowData.find(
        (row) => row[editRow] !== undefined
      );
      return matchingData ? matchingData[editRow] : "Value not found";
    };

    // Call this function when you want to find the matching value
    const matchingValue = findMatchingValue();
    setSingleValue(matchingValue && matchingValue);
  }, [selectedRowData, editRow]);
  // Function to handle the selection of a row
  const handleRowSelect = (rowIndex, rowData) => {
    if (selectedRows.includes(rowIndex)) {
      // Deselect the row by removing its data
      setSelectedRows(selectedRows.filter((id) => id !== rowIndex));
      setSelectedRowData(selectedRowData.filter((data) => data !== rowData));
    } else {
      // Select the row and store its data
      setSelectedRows([...selectedRows, rowIndex]);
      setSelectedRowData([...selectedRowData, rowData]);
    }
  };

  const handleMasterCheckboxChange = () => {
    if (selectedRows.length === tableData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows([...tableData?.map((_, index) => index)]);
    }
  };

  const handleApplyChanges = () => {
    // Handle apply changes logic here
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

  const renderTableData = () => {
    return showTableData ? (
      tableData.map((rowData, rowIndex) => (
        <TableRow key={rowIndex}>
          <TableCell>
            <Checkbox
              checked={selectedRows.includes(rowIndex)}
              onChange={() => handleRowSelect(rowIndex, rowData)}
            />
          </TableCell>
          {tableHeaders.map((header) => (
            <TableCell key={header}>{rowData[header]}</TableCell>
          ))}
        </TableRow>
      ))
    ) : (
      <Typography>No data found.</Typography>
    );
  };

  return (
    <div>
      {/* filters for editing the cells */}
      <Container sx={{ display: "flex", justifyContent: "center", gap: 3 }}>
        {/* ids of the selected rows => user can select id and edit related field */}
        <FormControl sx={{ width: "15rem" }}>
          <InputLabel>Select RowId</InputLabel>
          <Select>
            {rowId &&
              rowId.map((item) => <MenuItem key={item}>{item}</MenuItem>)}
          </Select>
        </FormControl>
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
          value={singleValue}
          onChange={(e) => setSingleValue(e.target.value)}
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
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ bgcolor: "#e3e1e1" }}>
            <TableRow>
              <TableCell>
                <Checkbox
                  checked={selectedRows.length === tableData.length}
                  onChange={handleMasterCheckboxChange}
                />
              </TableCell>
              {showTableData &&
                tableHeaders.map((headers) => <TableCell>{headers}</TableCell>)}
            </TableRow>
          </TableHead>
          <TableBody>{renderTableData()}</TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CompanyData;
