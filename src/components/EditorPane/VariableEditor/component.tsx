import * as React from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { AddButton, HorizontalButtons } from '../../PatchButton';
import usePatchStore from '../../../store';

export function VariableEditor() {
    return (
        <Grid container>
            <Grid item xs={12}>
                <GlobalVariablesInspector />
            </Grid>
        </Grid>
    );
}

function GlobalVariablesInspector() {

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
    const patchVM = usePatchStore((state) => state.patchVM);
    const setGlobalVariable = usePatchStore((state) => state.setGlobalVariable);
    const newVariableName = usePatchStore((state) => state.newVariableName);
    const newVariableValue = usePatchStore((state) => state.newVariableValue);

    const handleClick = () => {
        let name = newVariableName;
        let value = newVariableValue;
        if (typeof value === "string" && !Number.isNaN(parseInt(value))) {
            value = parseInt(value);
        }
        patchVM.updateGlobalVariable(name, value)
        setGlobalVariable(name, value);
    };

    return (
        <AddButton sx={{ height: '100%' }} onClick={handleClick} />
    );
}

function VarLine(props: { name: string, value: any }) {
    return (
        <HorizontalButtons>
            <Typography sx={{ fontSize: "18px", height: "24px" }} color='text.primary'>{props.name} = {props.value}</Typography>
        </HorizontalButtons>
    )
}

function VarList() {
    const globalVariables = usePatchStore((state) => state.globalVariables);
    return (
        <Grid item xs={12}>{globalVariables.map((variable) => {
            return <VarLine key={variable.name} name={variable.name} value={variable.value} />
        })}</Grid>
    );
}

const GlobalVariableInputField = () => {
    const setNewVariableName = usePatchStore((state) => state.setNewVariableName);
    const setNewVariableValue = usePatchStore((state) => state.setNewVariableValue);

    const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewVariableName(event.target.value);
    };

    const handleValueChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setNewVariableValue(event.target.value);
    };

    return (
        <Typography fontSize={24} alignContent={"center"} margin='dense'>
            <HorizontalButtons>
                <TextField
                    label="Variable Name"
                    id="varName"
                    size="small"
                    onChange={handleNameChange}
                    fullWidth
                />
                =
                <TextField
                    label="Value"
                    id="varValue"
                    size="small"
                    onChange={handleValueChange}
                    fullWidth
                />
                <PlusButton />
            </HorizontalButtons>
        </Typography>
    );
}
