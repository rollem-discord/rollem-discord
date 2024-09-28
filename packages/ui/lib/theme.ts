import { createTheme, responsiveFontSizes, adaptV4Theme } from "@mui/material";
import { lightBlue, purple } from "@mui/material/colors";


export const theme = responsiveFontSizes(createTheme(adaptV4Theme({
  palette: {
    mode: "dark",
    primary: {
      main: lightBlue[900],
    },
    secondary: {
      main: purple['A700'],
    }
  }
})));