import { grey, lightBlue, lightGreen, orange, teal, yellow } from "@mui/material/colors";


export function getColorByPosition(position) {
    let posColor = grey[500];
    switch (position) {
        case "1": posColor = yellow[200];
            break;
        case "2": posColor = grey[300];
            break;
        case "3": posColor = orange[200];
            break;
        case "4": posColor = lightGreen[200];
            break;
        case "5": posColor = lightBlue[200];
            break;
        case "6": posColor = teal[200];
            break;
        case "7": posColor = teal[300];
            break;
        case "8": posColor = teal[400];
            break;
        case "9": posColor = teal[500];
            break;
        case "10": posColor = teal[600];
            break;
    }
    return posColor;
}