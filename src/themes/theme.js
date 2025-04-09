import { createTheme } from "@mui/material";
import Kindest from "../fonts/KindestReality_DEMO.ttf";
import Gothic from "../fonts/Gothic.ttf";

const theme = createTheme({
  palette: {
    primary: {
      main: "#668C3C",
    },
    secondary: {
      main: "#0C2B1C",
    },
    lightGreen: {
      main: "#668C3C",
    },
    darkGreen: {
      main: "#0C2B1C",
    },
    cream: {
      main: "#CEC09D",
    },
    eggplant: {
      main: "#7A3C5F",
    },
    orange: {
      main: "#B55B2C",
    },
    straw: {
      main: "#A9A158",
    },
    sage: {
      main: "#568571",
    },
    brown: {
      main: "#A1762B",
    },
    purple: {
      main: "#5E617B",
    },
    gray: {
      main: "#919191",
    },
    white: {
      main: "#fff",
    },
    red: {
      main: "#DC2626",
    },
    lightGray: {
      main: "#EAEAEA",
    },
  },
  typography: {
    fontFamily: "Arial, Kindest, Gothic",
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'Gothic';
          src: local('Gothic'), url(${Gothic}) format('truetype');
        }
        @font-face {
          font-family: 'Kindest';
          src: local('Kindest'), url(${Kindest}) format('truetype');
        }
      `,
    },
  },
});

export { theme };
