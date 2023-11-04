import React, { useState } from "react";
import {
  Button,
  Checkbox,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { format } from "date-fns";
import { faker } from "@faker-js/faker";
import { Container } from "@mui/system";

const createRandomUser = () => {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.userName(),
    email: faker.internet.email(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  };
};

const rows = [];

for (let id = 1; id <= 50; id++) {
  const randomUser = createRandomUser();
  rows.push({
    id,
    ...randomUser,
  });
}

const CompanyData = () => {
  const [singleValue, setSingleValue] = useState();
  const [selectedRows, setSelectedRows] = useState([]);
  console.log(singleValue, selectedRows);
  // Function to handle the selection of a row
  const handleRowSelect = (rowId) => {
    if (selectedRows.includes(rowId)) {
      setSelectedRows(selectedRows.filter((id) => id !== rowId));
    } else {
      setSelectedRows([...singleValue, ...selectedRows, rowId]);
    }
  };

  const handleApplyChanges = () => {
    // setSelectedRows((prev) => [...singleValue, prev]);
  };

  return (
    <div>
      {/* filters for editing the cells */}
      <Container sx={{ display: "flex", gap: 3 }}>
        <TextField
          label="Enter Values"
          value={singleValue}
          onChange={(e) => setSingleValue(e.target.value)}
        />
        <Button variant="outlined" onClick={handleApplyChanges}>
          Apply
        </Button>
        <Button variant="contained">Save</Button>
      </Container>

      {/* main table */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>
                <Checkbox
                  // Check if all rows are selected
                  checked={selectedRows.length === rows.length}
                  onChange={() => {
                    if (selectedRows.length === rows.length) {
                      setSelectedRows([]);
                    } else {
                      setSelectedRows(rows.map((row) => row.id));
                    }
                  }}
                />
                Select
              </TableCell>
              <TableCell>UserID</TableCell>
              <TableCell>UserName</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>About</TableCell>
              <TableCell>Password</TableCell>
              <TableCell>BirthDate</TableCell>
              <TableCell>Registered</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedRows.includes(row.id)}
                    onChange={() => handleRowSelect(row.id)}
                  />
                </TableCell>
                <TableCell>{row.userId}</TableCell>
                <TableCell>{row.username}</TableCell>
                <TableCell>{row.email}</TableCell>
                <TableCell contentEditable>{row.about}</TableCell>
                <TableCell contentEditable>{row.password}</TableCell>
                <TableCell>{format(row.birthdate, "yyyy-MM-dd")}</TableCell>
                <TableCell>
                  {format(row.registeredAt, "yyyy-MM-dd HH:mm:ss")}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default CompanyData;
