import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useState } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

let globalVar = {};
export {globalVar};

export default function PatchVariables() {
    return (
        <Box
            sx={{
            height: 1,
            border: '1px dashed grey'
            }}>
            <Grid>
                <Grid container justifyContent="center">
                    <Grid item xs={12}>
                        <Typography align="center"><h1>Variables</h1></Typography>
                    </Grid>
                    <Grid>
                        <VariableInputField/>
                    </Grid>
                </Grid>
                <Grid container>
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
        setCurrentVars(Object.entries(globalVar).map(([name, value]) => <p style={styleVarList} key={name} align = "left">{name} = {value}</p>));

    };


    return (
        <> 
        <Grid container justifyContent ="center">
            <Grid item>
                <IconButton
            onClick={handleClick}
            style={{ color: "white"}}
            >
            <AddCircleIcon />
            </IconButton>
                </Grid>
        </Grid>
        <Grid item>{currentVars}</Grid>
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
