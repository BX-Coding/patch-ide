import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import Box from '@mui/material/Box';

let globalVar = {};
export {globalVar};

export default function PatchVariables() {
    return (
        <Box
            sx={{
            height: 1,
            border: '1px dashed grey'
            }}>
            <Grid container justifyContent="center">
                <Grid item xs={12}>
                    <h1 align="center">Variables</h1>
                </Grid>
                <Grid item xs={12}>
                    <VariableInputField/>
                </Grid>
                <Grid item xs={3}>
                    <PlusButton/>
                </Grid>
            </Grid>
        </Box>

    );
  }

export function PlusButton(){
    //don't know what to do here, center variable names
    const styleVarList={
        margin: 10,
    }

    const [currentVars, setCurrentVars] = useState("");
    const handleClick = (event) =>{
        let variableName = varName.value;
        let value = varValue.value;
        if(!isNaN(parseInt(value))){
            value = parseInt(value);
        }
        globalVar[variableName] = value;
        setCurrentVars(Object.entries(globalVar).map(([name, value]) => <p style={styleVarList} key={name}>{name}={value}</p>));

    };


    return (
        <> 
        <IconButton
            onClick={handleClick}
            style={{ color: "white"}}
        >
            <AddCircleIcon />
        </IconButton>
        {currentVars}
        </>

    );
}

export function VariableInputField(){
    return (
       <>
        <TextField
            label = "Variable Name"
            id="varName"
            variant="outlined"  
            size="small"
            sx={{ width: "90%", ml: "1vh", input: { color: 'white'}, fieldset: { borderColor: "white" }}}
            InputLabelProps={{style : {color : 'white'} }}
        />
        <p align="center">=</p>
        <TextField
            label = "Variable Value"
            id="varValue"
            variant="outlined"  
            size="small"
            sx={{ width: "90%", ml: "1vh", input: { color: 'white'}, fieldset: { borderColor: "white" }}}
            InputLabelProps={{style : {color : 'white'} }}
        /> 
        </>
    );
}
