import { createTheme, responsiveFontSizes } from "@mui/material";
import { lightBlue, purple } from "@mui/material/colors";


export const theme = responsiveFontSizes(createTheme({
  palette: {
    mode: "dark",
    primary: {
      main: lightBlue[900],
    },
    secondary: {
      main: purple['A700'],
    }
  }
}));