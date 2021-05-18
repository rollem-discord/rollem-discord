import { createMuiTheme, responsiveFontSizes } from "@material-ui/core";
import { lightBlue, purple } from "@material-ui/core/colors";


export const theme = responsiveFontSizes(createMuiTheme({
  palette: {
    type: "dark",
    primary: {
      main: lightBlue[900],
    },
    secondary: {
      main: purple['A700'],
    }
  }
}));