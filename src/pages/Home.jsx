import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { Button, Divider, ListItemText, TextField } from "@mui/material";
import {
  dateTypes,
  qc1Array,
  continents,
  countriesByContinent,
} from "../global/dataArray";
import CompanyData from "../components/CompanyData";
import { useNavigate } from "react-router-dom";
import { ResearchContext } from "../global/context/ContextProvider";
import axios from "axios";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, clientName, theme) {
  return {
    fontWeight:
      clientName.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
  };
}

const Home = () => {
  const theme = useTheme();
  const [clientName, setClientName] = useState([]);
  //languages from getting an api
  const [languages, setLanguages] = useState([]);

  const [filteredCountries, setFilteredCountries] = useState([]);
  const navigate = useNavigate();
  const {
    clients,
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
    setShowTableData,
    dateType,
    setDateType,
    language,
    setLanguage,
    continent,
    setContinent,
    country,
    setCountry,
  } = useContext(ResearchContext);
  // fetching the companies
  const fetchCompany = async () => {
    try {
      const result =
        clientName &&
        (await axios.get(`http://51.68.220.77:8000/companylist/${clientId}`));
      if (result) {
        setCompany(result.data.companies);
        setCompanies([]);
        setShowTableData(false);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    if (clientId) {
      fetchCompany();
    }
  }, [clientId]);
  //  fetching langueges
  const fetchLanguage = async () => {
    try {
      const response = await axios.get(
        "http://51.68.220.77:8000/languagelist/"
      );
      if (response) {
        setLanguages(response.data.languages);
      }
    } catch (error) {
      console.error("Error fetching languages:", error);
    }
  };
  useEffect(() => {
    fetchLanguage();
  }, [language]);
  const handleChange = (event) => {
    const {
      target: { value },
    } = event;

    // Find the selected client based on the clientname
    const selectedClient = clients.find(
      (client) => client.clientname === value
    );

    // Set the clientId in the state
    if (selectedClient) {
      setClientId(selectedClient.clientid);
    }

    // Set the selected client name
    setClientName(value);
  };
  const handleSelectedCompanies = (event) => {
    const {
      target: { value },
    } = event;
    setCompanies(value);
  };
  const handleDateTypeChange = (event) => {
    const {
      target: { value },
    } = event;
    setDateType(typeof value === "string" ? value.split(",") : value);
  };
  const handleQc1 = (event) => {
    const {
      target: { value },
    } = event;
    setQc1(typeof value === "string" ? value.split(", ") : value);
  };
  const handleLanguageChange = (event) => {
    setLanguage(event.target.value);
  };
  const handleContinentChange = (event) => {
    const {
      target: { value },
    } = event;
    const selectedContinent =
      typeof value === "string" ? value.split(", ") : value;

    // Filter countries by the selected continent
    const selectedCountries = countriesByContinent
      .filter((item) => selectedContinent.includes(item.continent))
      .map((item) => item.countries)
      .flat();

    setContinent(selectedContinent);
    setFilteredCountries(selectedCountries);
  };
  const handleSearch = () => {
    setShowTableData(
      (companies && companies.length === 1) || companies.length > 1
        ? true
        : false
    );
  };
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };
  return (
    <div>
      {/* title */}
      <h2 className="text-center mb-4 font-bold text-lg uppercase">
        Research Screen
      </h2>
      {/* Category dropdowns filter out */}
      {/* client */}
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-name-label">Client</InputLabel>
        <Select
          labelId="demo-multiple-name-label"
          id="demo-multiple-name"
          value={clientName}
          onChange={handleChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
        >
          {clients &&
            clients.map((client) => (
              <MenuItem
                key={client.clientid}
                value={client.clientname}
                style={getStyles(client.clientname, clientName, theme)}
              >
                {client.clientname}
              </MenuItem>
            ))}
        </Select>
      </FormControl>
      {/* comapany */}
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-multiple-checkbox-label">Company</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          id="demo-multiple-checkbox"
          multiple
          value={companies}
          onChange={handleSelectedCompanies}
          input={<OutlinedInput label="Name" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {company &&
            company.map((companyItem) => (
              <MenuItem
                key={companyItem.companyid}
                value={companyItem.companyname}
              >
                <ListItemText primary={companyItem.companyname} />
              </MenuItem>
            ))}
        </Select>
      </FormControl>

      {/* Dataetype */}
      <FormControl sx={{ m: 1, width: 300 }}>
        <InputLabel id="demo-mutiple-chip-label">Datetype</InputLabel>
        <Select
          labelId="demo-multiple-checkbox-label"
          value={dateType}
          onChange={handleDateTypeChange}
          input={<OutlinedInput label="Tag" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {dateTypes.map((dateType) => (
            <MenuItem
              key={dateType}
              value={dateType}
              style={getStyles(dateType, dateType, theme)}
            >
              {dateType}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* date filter from date */}
      <FormControl sx={{ m: 1, width: 300 }}>
        <TextField
          type="date"
          value={fromDate}
          onChange={(e) => setFromDate(e.target.value)}
        />
      </FormControl>
      {/* date filter to now date */}
      <FormControl sx={{ m: 1, width: 300 }}>
        <TextField
          type="date"
          value={dateNow}
          onChange={(e) => setDateNow(e.target.value)}
        />
      </FormControl>
      {/* searchBox for searching an article */}
      <FormControl sx={{ m: 1, width: 400 }}>
        <TextField label="Search" />
      </FormControl>
      {/* qc1 */}
      <FormControl sx={{ m: 1, width: 200 }}>
        <InputLabel id="qc1-select-label">QC1</InputLabel>
        <Select
          id="qc1-checks"
          value={qc1}
          onChange={handleQc1}
          input={<OutlinedInput label="tag" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {qc1Array.map((option) => (
            <MenuItem key={option} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* users */}
      <FormControl sx={{ m: 1, width: 200 }}>
        <InputLabel id="users-select-label">Users</InputLabel>
      </FormControl>
      {/* languages */}
      <FormControl sx={{ m: 1, width: 200 }}>
        <InputLabel id="languages-select-label">Languages</InputLabel>
        <Select
          id="languages"
          value={language}
          onChange={handleLanguageChange}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
          multiple
        >
          {Object.entries(languages).map(([languagename, languagecode]) => (
            <MenuItem key={languagecode} value={languagecode}>
              {languagename}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* continents */}
      <FormControl sx={{ m: 1, width: 200 }}>
        <InputLabel id="continent-type-select-label">Continent</InputLabel>
        <Select
          id="continents"
          value={continent}
          onChange={handleContinentChange}
          input={<OutlinedInput label="Name" />}
          renderValue={(selected) => selected.join(", ")}
          MenuProps={MenuProps}
        >
          {continents.map((continent) => (
            <MenuItem key={continent} value={continent}>
              {continent}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* countries */}
      <FormControl sx={{ m: 1, width: 200 }}>
        <InputLabel id="countries-select-label">Countries</InputLabel>
        <Select
          id="countries"
          value={country}
          onChange={(e) => setCountry(e.target.value)}
          input={<OutlinedInput label="Name" />}
          MenuProps={MenuProps}
          multiple
        >
          {filteredCountries.map((country) => (
            <MenuItem key={country} value={country}>
              {country}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      {/* search Button */}
      <Button
        onClick={handleSearch}
        variant="contained"
        sx={{ m: 1, width: 100, height: 50 }}
      >
        Search
      </Button>
      {/* logout */}
      <div className="text-right mr-4">
        <Button variant="contained" onClick={handleLogout}>
          Logout
        </Button>
      </div>
      {/* divider */}
      <Divider variant="middle" sx={{ m: 2 }} />
      {/* table */}
      <div>
        <CompanyData />
      </div>
    </div>
  );
};

export default Home;
