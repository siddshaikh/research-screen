import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#d9182e",
    },
    secondary: {
      main: "#808080",
    },
  },
  components: {
    MuiInput: {
      styleOverrides: {
        focused: {
          borderColor: "#808080",
        },
      },
    },
  },
});

export default theme;
