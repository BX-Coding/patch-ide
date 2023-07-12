import React, { useContext } from 'react';
import Button from '@mui/material/Button'
import pyatchContext from './provider/PyatchContext.js';
import FlagIcon from '@mui/icons-material/Flag';
import DangerousIcon from '@mui/icons-material/Dangerous';

export function PyatchStartButton(props) {
    const { onFlagPressed } = useContext(pyatchContext);

    return(
        <Button variant="contained" onClick={onFlagPressed}><FlagIcon/></Button>
    );
}

export function PyatchStopButton(props) {
    const { pyatchVM } = useContext(pyatchContext);

    return(
        <Button variant="contained" color="error" onClick={pyatchVM?.stopAll.bind(pyatchVM)}><DangerousIcon/></Button>
    );
}