import { Routes, Route } from "react-router-dom";
import { CssBaseline, ThemeProvider } from "@mui/material";
import Login from "./pages/Login";
import Home from "./pages/Home";
import theme from "./components/theme";
import { useContext, useEffect } from "react";
import { ResearchContext } from "./context/ContextProvider";
import NotFound from "./components/NotFound";
import { checkUserAuthenticate } from "./auth/auth";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const { userToken, setUserToken } = useContext(ResearchContext);
  useEffect(() => {
    checkUserAuthenticate(setUserToken);
  }, []);
  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ToastContainer />
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/" element={userToken ? <Home /> : <Login />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </ThemeProvider>
    </div>
  );
}

export default App;
