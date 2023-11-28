import React, { useContext, useEffect, useState } from "react";
import { useTheme } from "@mui/material/styles";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import {
  Button,
  Checkbox,
  Divider,
  FormControlLabel,
  FormGroup,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";
import {
  dateTypes,
  qc1Array,
  continents,
  countriesByContinent,
} from "../global/dataArray";
import CompanyData from "../components/CompanyData";
import { useNavigate } from "react-router-dom";
import { ResearchContext } from "../context/ContextProvider";
import useFetchData from "../hooks/useFetchData";
import Loader from "../components/Loader";
import axios from "axios";

const ITEM_HEIGHT = 32;
const ITEM_PADDING_TOP = 4;

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, clientName, theme) {
  if (Array.isArray(clientName)) {
    return {
      fontWeight:
        clientName.indexOf(name) === -1
          ? theme.typography.fontWeightRegular
          : theme.typography.fontWeightMedium,
    };
  }
  return {
    fontWeight: theme.typography.fontWeightRegular,
  };
}

const Home = () => {
  const theme = useTheme();
  const [clients, setClients] = useState([]);

  const [clientName, setClientName] = useState([]);
  //languages from getting an api
  const [languages, setLanguages] = useState([]);
  // qcusers data
  const [qcUsersData, setQcUsersData] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  // loading state for the tableData fetching
  const [tableDataLoading, setTableDataLoading] = useState(false);
  // converting arrays to the string.
  const [langsTostring, setLangsToString] = useState("");
  const [continentsTostring, setContinentsToString] = useState("");
  const [countriesToString, setCountriesToString] = useState("");
  const [qc1byuserToString, setQc1byuserToString] = useState("");
  const [qc2byuserToString, setQc2byuserToString] = useState("");

  const navigate = useNavigate();
  const {
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
    userToken,
    setTableData,
    setTableHeaders,
  } = useContext(ResearchContext);
  // base url
  const base_url = process.env.REACT_APP_BASE_URL;
  // clients
  const {
    data: clientData,
    error: ClientEror,
    loading: clientLoading,
  } = useFetchData(`${base_url}clientlist/`);
  useEffect(() => {
    if (clientData.data) {
      setClients(clientData.data.clients);
      setLanguage([]);
    } else {
      console.log(ClientEror);
    }
  }, [clientData, setClients, ClientEror, setLanguage]);
  // fetching the companies
  const {
    data: companyData,
    error: companyError,
    loading: companyLoading,
  } = useFetchData(clientId ? `${base_url}companylist/${clientId}` : "");
  useEffect(() => {
    if (clientId || companyData.data) {
      setCompany(companyData?.data?.companies || []);
      setCompanies([]);
      setShowTableData(false);
    } else {
      console.log(companyError);
    }
  }, [
    clientId,
    companyData,
    setCompany,
    setCompanies,
    setShowTableData,
    companyError,
  ]);
  //fetching qcusers
  const { data: qcUserData, error: qcUserDataError } = useFetchData(
    `${base_url}qcuserlist/`
  );
  useEffect(() => {
    if (qcUserData.data) {
      setQcUsersData(qcUserData.data.qc_users);
    } else {
      console.log(qcUserDataError);
    }
  }, [qcUserData, qcUserDataError]);
  //  fetching langueges
  const {
    data: langs,
    error: langsError,
    loading: langsLoading,
  } = useFetchData(`${base_url}languagelist/`);

  useEffect(() => {
    if (langs.data) {
      setLanguages(langs.data.languages);
    } else {
      console.log(langsError);
    }
  }, [langs, langsError]);

  // loading states
  const isLoading = clientLoading || companyLoading || langsLoading;
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
    setCompanies(value ? value : "");
  };
  const handleDateTypeChange = (event) => {
    setDateType(event.target.value);
  };
  const handleQc1done = (event) => {
    setQc1done(event.target.value);
  };
  const handleQc2done = (event) => {
    setQc2done(event.target.value);
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

  const arrayToString = (arr) => {
    if (Array.isArray(arr)) {
      if (arr.length > 0) {
        return arr.map((item) => `'${item}'`).join(",");
      } else {
        return "";
      }
    } else {
      return "";
    }
  };
  useEffect(() => {
    const langsV = arrayToString(language);
    const continentV = arrayToString(continent);
    const countriesV = arrayToString(country);
    const qc1_userV = arrayToString(qc1by);
    const qc2_userV = arrayToString(qc2by);
    setLangsToString(langsV);
    setContinentsToString(continentV);
    setCountriesToString(countriesV);
    setQc1byuserToString(qc1_userV);
    setQc2byuserToString(qc2_userV);
  }, [language, continent, country, qc1by, qc2by]);
  // searching the tabledata using multiple parameters
  const handleSearch = async () => {
    setShowTableData(companies ? true : false);
    setTableDataLoading(true);

    try {
      let requestData = {
        client_id: clientId,
        // company_id: "'690','GOOGLE_AND','1222'", //optional using condition
        date_type: dateType,
        from_date: fromDate,
        to_date: dateNow,
        search_text: "",
        // qc1_by: "qc1_user", //optional using condition
        // qc2_by: "qc2_user", //optional using condition
        is_qc1: qc1done,
        is_qc2: qc2done,
        has_image: isImage,
        has_video: isVideo,
        // continent: "Asia", //optional using condition
        // country: "India",  //optional using condition
        // language: langsTostring, //optional using condition
      };

      function addPropertyIfConditionIsTrue(condition, property, value) {
        if (condition) {
          requestData[property] = value;
        }
      }
      addPropertyIfConditionIsTrue(companyId, "company_id", companyId);
      addPropertyIfConditionIsTrue(
        qc1byuserToString,
        "qc1_by",
        qc1byuserToString
      );
      addPropertyIfConditionIsTrue(
        qc2byuserToString,
        "qc2_by",
        qc2byuserToString
      );
      addPropertyIfConditionIsTrue(
        continentsTostring,
        "continent",
        continentsTostring
      );
      addPropertyIfConditionIsTrue(
        countriesToString,
        "country",
        countriesToString
      );
      addPropertyIfConditionIsTrue(langsTostring, "language", langsTostring);

      const requestDataJSON = JSON.stringify(requestData);
      const url = "http://51.68.220.77:8000/listArticlebyQC/";

      const response = await axios.post(url, requestDataJSON, {
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
      setTableDataLoading(false);
    } catch (error) {
      console.log(error);
      setTableDataLoading(false);
      setTableData([]);
    }
  };
  const handleLogout = () => {
    if (timerId) {
      clearTimeout(timerId);
      setTimerId(null);
    }
    localStorage.removeItem("user");
    navigate("/login");
    setQc1by([]);
    setQc2by([]);
  };
  return (
    <div>
      <div className="flex items-center justify-between mx-4">
        {/* title */}
        <h2 className="text-center mb-4 font-bold text-lg uppercase">
          Research Screen
        </h2>
        {/* logout */}
        <Button
          variant="contained"
          onClick={handleLogout}
          sx={{ height: 30, fontSize: "0.8em" }}
        >
          Logout
        </Button>
      </div>
      <Divider variant="middle" sx={{ m: 2 }} />
      {/* Category dropdowns filter out */}
      {/* client */}
      {isLoading ? (
        <Loader />
      ) : (
        <>
          {/* clients */}
          <FormControl sx={{ m: 1, width: 200 }}>
            <InputLabel
              id="demo-multiple-name-label"
              sx={{ fontSize: "0.8rem", margin: "-7px" }}
            >
              Client
            </InputLabel>
            <Select
              labelId="demo-multiple-name-label"
              id="demo-multiple-name"
              placeholder="select"
              value={clientName}
              onChange={handleChange}
              input={<OutlinedInput label="Name" />}
              MenuProps={MenuProps}
              sx={{ height: 30, fontSize: "0.8em" }}
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
          <FormControl sx={{ m: 1, width: 200 }}>
            <InputLabel
              id="demo-multiple-checkbox-label"
              sx={{ fontSize: "0.8rem", margin: "-7px" }}
            >
              Company
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              id="demo-multiple-checkbox"
              multiple
              value={companies && companies}
              onChange={handleSelectedCompanies}
              input={<OutlinedInput label="Name" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
              sx={{ height: 30, textAlign: "center", fontSize: "0.8em" }}
            >
              {company &&
                company?.map((companyItem) => (
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
          <FormControl sx={{ m: 1, width: 200, height: "30px" }}>
            <InputLabel
              id="demo-mutiple-chip-label"
              sx={{ fontSize: "0.8rem", margin: "-7px" }}
            >
              Datetype
            </InputLabel>
            <Select
              labelId="demo-multiple-checkbox-label"
              value={dateType}
              onChange={handleDateTypeChange}
              input={<OutlinedInput label="Tag" />}
              MenuProps={MenuProps}
              sx={{ height: 30, fontSize: "0.8em" }}
            >
              {dateTypes.map((dateType) => (
                <MenuItem
                  key={dateType.id}
                  value={dateType.value}
                  style={getStyles(dateType, dateType, theme)}
                >
                  {dateType.title}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* date filter from date */}
          <FormControl sx={{ m: 1, width: 200 }}>
            <TextField
              type="datetime-local"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
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
          </FormControl>
          {/* date filter to now date */}
          <FormControl sx={{ m: 1, width: 200 }}>
            <TextField
              type="datetime-local"
              value={dateNow}
              onChange={(e) => setDateNow(e.target.value)}
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
          </FormControl>
          {/* qc1 */}
          <FormControl sx={{ m: 1, width: 100 }}>
            <InputLabel
              id="qc1-select-label"
              sx={{ fontSize: "0.8rem", margin: "-7px" }}
            >
              QC1 by
            </InputLabel>
            <Select
              id="qc1-checks"
              input={<OutlinedInput label="tag" />}
              MenuProps={MenuProps}
              sx={{ height: 30, fontSize: "0.8em" }}
              value={qc1by}
              onChange={(e) => setQc1by(e.target.value)}
              multiple
            >
              {qcUsersData &&
                qcUsersData?.map((items) => (
                  <MenuItem key={items.usersid} value={items.usersid}>
                    {items.username}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {/* qc2 */}
          <FormControl sx={{ m: 1, width: 100 }}>
            <InputLabel
              id="qc1-select-label"
              sx={{ fontSize: "0.8rem", margin: "-7px" }}
            >
              QC2 by
            </InputLabel>
            <Select
              id="qc1-checks"
              input={<OutlinedInput label="tag" />}
              MenuProps={MenuProps}
              sx={{ height: 30, fontSize: "0.8em" }}
              value={qc2by}
              onChange={(e) => setQc2by(e.target.value)}
              multiple
            >
              {qcUsersData &&
                qcUsersData?.map((items) => (
                  <MenuItem key={items.usersid} value={items.usersid}>
                    {items.username}
                  </MenuItem>
                ))}
            </Select>
          </FormControl>
          {/* qc1 done */}
          <FormControl sx={{ m: 1, width: 100 }}>
            <InputLabel
              id="users-select-label"
              sx={{ fontSize: "0.8rem", margin: "-7px" }}
            >
              Isqc1 Done
            </InputLabel>
            <Select
              id="qc1-checks"
              value={qc1done}
              onChange={handleQc1done}
              input={<OutlinedInput label="tag" />}
              MenuProps={MenuProps}
              sx={{ height: 30, fontSize: "0.8em" }}
            >
              {qc1Array.map((item) => (
                <MenuItem key={item.id} value={item.value}>
                  {item.option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* qc2 done */}
          <FormControl sx={{ m: 1, width: 100 }}>
            <InputLabel
              id="users-select-label"
              sx={{ fontSize: "0.8rem", margin: "-7px" }}
            >
              Isqc2 Done
            </InputLabel>
            <Select
              id="qc1-checks"
              value={qc2done}
              onChange={handleQc2done}
              input={<OutlinedInput label="tag" />}
              MenuProps={MenuProps}
              sx={{ height: 30, fontSize: "0.8em" }}
            >
              {qc1Array.map((item) => (
                <MenuItem key={item.id} value={item.value}>
                  {item.option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* image checkbox */}
          <FormControl>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isImage === 1}
                    onChange={() => {
                      setIsImage(isImage === 1 ? 0 : 1);
                      setIsVideo(0);
                    }}
                  />
                }
                label={<Typography variant="body2">Image</Typography>}
              />
            </FormGroup>
          </FormControl>
          {/* video checkbox */}
          <FormControl>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={isVideo === 1} // Check if isVideo equals 1
                    onChange={() => {
                      setIsVideo(isVideo === 1 ? 0 : 1); // Toggle isVideo between 0 and 1
                      setIsImage(0); // Ensure only one type is displayed at a time
                    }}
                  />
                }
                label={<Typography variant="body2">Video</Typography>}
              />
            </FormGroup>
          </FormControl>
          {/* searchBox for searching an article */}
          <FormControl sx={{ m: 1, width: 300 }}>
            <TextField
              placeholder="Search"
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
          </FormControl>

          {/* languages */}
          <FormControl sx={{ m: 1, width: 150 }}>
            <InputLabel
              id="languages-select-label"
              sx={{ fontSize: "0.8rem", margin: "-7px" }}
            >
              Languages
            </InputLabel>
            <Select
              id="languages"
              value={language}
              onChange={handleLanguageChange}
              input={<OutlinedInput label="Name" />}
              MenuProps={MenuProps}
              multiple
              sx={{ height: 30, fontSize: "0.8em" }}
            >
              {Object.entries(languages).map(([languagename, languagecode]) => (
                <MenuItem key={languagecode} value={languagecode}>
                  {languagename}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* continents */}
          <FormControl sx={{ m: 1, width: 150 }}>
            <InputLabel
              id="continent-type-select-label"
              sx={{ fontSize: "0.8rem", margin: "-7px" }}
            >
              Continent
            </InputLabel>
            <Select
              id="continents"
              value={continent}
              onChange={handleContinentChange}
              input={<OutlinedInput label="Name" />}
              renderValue={(selected) => selected.join(", ")}
              MenuProps={MenuProps}
              sx={{ height: 30, fontSize: "0.8em" }}
              multiple
            >
              {continents.map((continent) => (
                <MenuItem key={continent} value={continent}>
                  {continent}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {/* countries */}
          <FormControl sx={{ m: 1, width: 150 }}>
            <InputLabel
              id="countries-select-label"
              sx={{ fontSize: "0.8rem", margin: "-7px" }}
            >
              Countries
            </InputLabel>
            <Select
              id="countries"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              input={<OutlinedInput label="Name" />}
              MenuProps={MenuProps}
              multiple
              sx={{ height: 30, fontSize: "0.8em" }}
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
            sx={{
              m: 1,
              width: 100,
              height: 30,
              bgcolor: tableDataLoading ? "red" : "gray",
              color: "white",
              fontSize: "0.8em",
              "&:hover": {
                bgcolor: tableDataLoading ? "red" : "gray",
              },
            }}
          >
            {tableDataLoading ? "Loading..." : "Search"}
          </Button>

          {/* divider */}
          <Divider variant="middle" sx={{ m: 2 }} />
          {/* table */}
          <div>
            <CompanyData />
          </div>
        </>
      )}
    </div>
  );
};

export default Home;
