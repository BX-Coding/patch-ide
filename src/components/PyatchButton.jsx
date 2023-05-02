import React, { useContext } from 'react';
import Button from '@mui/material/Button'
import pyatchContext from './provider/PyatchContext.js';
import FlagIcon from '@mui/icons-material/Flag';
import DangerousIcon from '@mui/icons-material/Dangerous';

export function PyatchStartButton(props) {
    const { pyatchEditor } = useContext(pyatchContext);

    return(
        <Button variant="contained" onClick={pyatchEditor.onRunPress} disabled={pyatchEditor.runDisabled}><FlagIcon/></Button>
    );
}

export function PyatchStopButton(props) {
    const { pyatchEditor } = useContext(pyatchContext);

    return(
        <Button variant="outlined" color="error" onClick={pyatchEditor.onStop} disabled={pyatchEditor.stopDisabled}><DangerousIcon/></Button>
    );
}