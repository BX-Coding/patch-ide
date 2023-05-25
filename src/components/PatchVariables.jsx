import * as React from 'react';
import IconButton from '@mui/material/IconButton';
import AddCircleIcon from '@mui/icons-material/AddCircle';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useState, useContext, createContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PyatchContext from "./provider/PyatchContext.js";

export default function PatchVariables() {

    return (
        <Box
            sx={{
            height: 1,
            border: '1px dashed grey',
            height: '150%',
            mb: "1vh"
            }}>
            <Grid>
                <Grid container justifyContent="center">
                    <Grid item xs={12}>
                        <Typography align="center" variant="h6">Global Variables</Typography>
                    </Grid>
                </Grid>
                <Grid container sx={{ alignItems: 'center' }}>
                    <Grid item xs={10} sx={{mb:"1vh"}}>
                        <VariableInputField/>
                    </Grid>
                    <Grid item xs={2}>
                        <PlusButton/>
                    </Grid>
                    <Grid item xs={12} sx={{ml:"1vh"}}><VarList/></Grid>
                </Grid>
            </Grid>
        </Box>

    );
  }

function PlusButton(){
    const { pyatchEditor } = useContext(PyatchContext);

    const handleClick = (event) =>{
        let name = varName.value;
        let value = varValue.value;
        if(!Number.isNaN(parseInt(value))){
            value = parseInt(value);
        }
        pyatchEditor.setGlobalVariables(() => ({
            ...pyatchEditor.globalVariables,
            [name]:value
        }));

    };

    return (
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
    );
}

function VarLine(props) {
    return (
        <Typography>{props.name} = {props.value}</Typography>
    )
}

function VarList() {
    const { pyatchEditor } = useContext(PyatchContext);
    return(
        <Grid item xs={12}>{Object.keys(pyatchEditor.globalVariables).map((name) => {
            return <VarLine key = {name} name={name} value={pyatchEditor.globalVariables[name]}/>
        })}</Grid>
    );
}

function VariableInputField(){
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
