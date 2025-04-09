import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Main from "./Main";
import { ThemeProvider } from "@mui/material";
import { theme } from "./themes/theme";
import './config';

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <ThemeProvider theme={theme}>
    <Main />
  </ThemeProvider>
);
