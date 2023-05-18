import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useState, useContext, createContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import pyatchContext from './provider/PyatchProvider.jsx';

let globalVar = {};
export {globalVar};

const VarsContext = createContext("");
export default function PatchVariables() {
    const [currentVars, setCurrentVars] = useState("");
    return (
        <VarsContext.Provider value={{currentVars,setCurrentVars}}>
        <Box
            sx={{
            height: 1,
            border: '1px dashed grey'
            }}>
            <Grid>
                <Grid container justifyContent="center">
                    <Grid item xs={12}>
                        <Typography align="center" variant="h6">Global Variables</Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ alignItems: 'center' }}>
                    <Grid item xs={10}>
                        <VariableInputField/>
                    </Grid>
                    <Grid item xs={2}>
                        <PlusButton/>
                    </Grid>
                    <Grid item xs={12} sx={{ml:"1vh"}}><VarList/></Grid>
                </Grid>
            </Grid>
        </Box>
        </VarsContext.Provider>

    );
  }

export function PlusButton(){
        const {currentVars, setCurrentVars} = useContext(VarsContext);
        const handleClick = (event) =>{
        let variableName = varName.value;
        let value = varValue.value;
        if(!isNaN(parseInt(value))){
            value = parseInt(value);
        }
        globalVar[variableName] = value;
        const newVar = { variableName : value };
        setCurrentVars(Object.entries(globalVar).map(([name, value]) => <Typography key={name} align = "left">{name} = {value}</Typography>));

    };


    return (
        <> 
        <Grid container>
            <Grid item xs={12}>
                <IconButton
            onClick={handleClick}
            style={{ color: "white"}}
            >
            <AddCircleIcon />
            </IconButton>
                </Grid>
        </Grid>
        </>

    );
}

export function VarList(){
    const {currentVars, setCurretVars} = useContext(VarsContext);
    console.log(currentVars);
    return(
        <Grid>{currentVars}</Grid>
    );
}

export function VariableInputField(){
    return (
       <>
        <Grid>
                
                <Grid container item direction="row" justifyContent="center" sx={{ alignItems: 'center' }}>
                    <Grid item xs={6.5}>
                <Typography variant="outlined" margin='dense' sx={{ input: { color: 'white'}, fieldset: { borderColor: "white" }}}>
                    <TextField
                    label = "Variable Name"
                    id="varName"
                    size = "small"
                    fullWidth
                    InputLabelProps={{style : {color : 'white'} }}
                    InputProps={{style:{height: "2em"}}}
                />
                </Typography>
                </Grid>
                <Grid item xs={0.5}>
                <Typography align="center">=</Typography>
                </Grid>
                <Grid item xs={4}>
                    <Typography variant="outlined" margin = 'dense'sx={{input: { color: 'white'}, fieldset: { borderColor: "white" }}}>
                    <TextField
                        label = "Value"
                        id="varValue"
                        size="small"
                        fullWidth
                        InputLabelProps={{style : {color : 'white'} }}
                        InputProps={{style:{height: "2em"}}}
                    /> </Typography>
                </Grid>
                </Grid>
        </Grid>
        </>
    );
}
