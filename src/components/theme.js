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
    MuiInputLabel: {
      root: {
        "&.Mui-focused": {
          color: "#808080",
        },
      },
    },
    MuiInput: {
      underline: {
        "&:before": {
          borderBottomColor: "#808080",
        },
        "&:hover:not(.Mui-disabled):before": {
          borderBottomColor: "#808080",
        },
        "&.Mui-focused:after": {
          borderBottomColor: "#808080",
        },
      },
    },
  },
});

export default theme;
