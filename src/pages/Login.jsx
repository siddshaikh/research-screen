import React, { useContext, useState } from "react";
import { Button, TextField, Paper, Typography, Box } from "@mui/material";
import { styled } from "@mui/system";
import { css } from "@emotion/react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { ResearchContext } from "../context/ContextProvider";

const loginFormStyles = css`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(2),
  maxWidth: 400,
}));

const StyledButton = styled(Button)(({ theme }) => ({
  width: "100%",
}));

function Login() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { name, setName, setUserToken, setTimerId } =
    useContext(ResearchContext);

  const authenticateUser = async () => {
    try {
      const res = await axios.post("http://51.68.220.77:8000/authenticate/", {
        loginname: name,
        password: password,
      });
      if (res.status === 200) {
        localStorage.setItem("user", res.data.access_token);
        setUserToken(localStorage.getItem("user"));
        const timer = setTimeout(() => {
          localStorage.removeItem("user");
          navigate("/login");
        }, 300000); // 5 minutes in millisecond
        setTimerId(timer);
        navigate("/");
      }
    } catch (error) {
      setError("Something Went Wrong Please Try again.");
    }
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    authenticateUser();
  };

  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <StyledPaper>
        <Typography variant="h5" gutterBottom>
          Login
        </Typography>
        <Typography sx={{ color: "red" }}>{error && error}</Typography>
        <form css={loginFormStyles} onSubmit={handleSubmit}>
          <TextField
            label="Name"
            type="text"
            fullWidth
            margin="normal"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <TextField
            label="Password"
            type="password"
            fullWidth
            margin="normal"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <StyledButton variant="contained" color="primary" type="submit">
            Login
          </StyledButton>
        </form>
      </StyledPaper>
    </Box>
  );
}

export default Login;
