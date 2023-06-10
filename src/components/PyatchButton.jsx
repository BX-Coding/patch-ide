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
    const { pyatchVM } = useContext(pyatchContext);

    return(
        <Button variant="contained" color="error" onClick={pyatchVM?.stopAll.bind(pyatchVM)} sx={{mb: "1vh"}}><DangerousIcon/></Button>
    );
}