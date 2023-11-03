import { createTheme } from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import React from "react";
import "react-toastify/dist/ReactToastify.min.css";
import "./App.scss";
import Router from "./Router";

const theme = createTheme({
  palette: {
    secondary: {
      main: "##AC4848"
    },
    primary: {
      main: "#182939",
    }
  }
});

const App: React.FC = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  );
};

export default App;
