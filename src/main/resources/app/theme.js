/** 
 * This file describes the Material theme used by this app 
 */

// Material UI 
import { createMuiTheme } from "@material-ui/core/styles";
import teal from "@material-ui/core/colors/teal";
import lightBlue from "@material-ui/core/colors/lightBlue";

export default createMuiTheme({
    palette: {
        primary: {
            light: '#82e9de',
            main: teal[300],
            dark: teal[600],
            contrastText: '#0000',
        },
        secondary: {
            light: '#58a5f0',
            main: lightBlue[800],
            dark: '#004c8c',
            contrastText: '#ffff',
        },
    },
}); 