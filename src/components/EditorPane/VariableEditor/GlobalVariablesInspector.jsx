import * as React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { useContext } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import PyatchContext from "../../provider/PatchContext.js";
import { AddButton, HorizontalButtons } from '../../PatchButton/component.jsx';

export default function GlobalVariablesInspector() {

    return (
        <Box
            sx={{
                borderTop: '1px solid divider',
                backgroundColor: 'panel.default',
                minHeight: "calc(100vh - 123px)",
                padding: '8px',
            }}>
            <Grid>
                <Grid container justifyContent="center">
                    <Grid item xs={12}>
                        <Typography color='text.primary' align="center" variant="h6">Global Variables</Typography>
                    </Grid>
                </Grid>
                <GlobalVariableInputField />
            </Grid>
            <VarList />
        </Box>
    );
}

function PlusButton() {
    const { setGlobalVariables, pyatchVM } = useContext(PyatchContext);

    const handleClick = (event) => {
        let name = varName.value;
        let value = varValue.value;
        if (!Number.isNaN(parseInt(value))) {
            value = parseInt(value);
        }
        pyatchVM.updateGlobalVariable(name, value)
        setGlobalVariables(pyatchVM.getGlobalVariables());
    };

    return (
        <AddButton sx={{ height: '100%' }} onClick={handleClick} />
    );
}

function VarLine(props) {
    return (
        <HorizontalButtons>
            <Typography sx={{ fontSize: "18px", height: "24px" }} color='text.primary'>{props.name} = {props.value}</Typography>
        </HorizontalButtons>
    )
}

function VarList() {
    const { globalVariables } = useContext(PyatchContext);
    return (
        <Grid item xs={12}>{globalVariables.map((variable) => {
            return <VarLine key={variable.name} name={variable.name} value={variable.value} />
        })}</Grid>
    );
}

function GlobalVariableInputField() {
    return (
        <Typography fontSize={24} alignContent={"center"} variant="outlined" margin='dense'>
            <HorizontalButtons>
                <TextField
                    label="Variable Name"
                    id="varName"
                    size="small"
                    fullWidth
                />
                =
                <TextField
                    label="Value"
                    id="varValue"
                    size="small"
                    fullWidth
                />
                <PlusButton />
            </HorizontalButtons>
        </Typography>
    );
}