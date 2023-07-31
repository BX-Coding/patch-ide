import React, { useContext } from 'react';
import Button from '@mui/material/Button'
import patchContext from '../provider/PatchContext.js';
import FlagIcon from '@mui/icons-material/Flag';
import DangerousIcon from '@mui/icons-material/Dangerous';

export function StartButton(props) {
    const { runButtonDisabled } = useContext(patchContext);

    const onFlagPressed = async () => {
        await saveAllThreads();
        setRuntimeErrorList([]);
        setRunButtonDisabled(true);
        await pyatchVM.greenFlag();
        setRunButtonDisabled(false);
      }

    return(
        <Button variant="contained" onClick={onFlagPressed} disabled={runButtonDisabled}><FlagIcon/></Button>
    );
}

export function StopButton(props) {
    const { pyatchVM } = useContext(patchContext);

    return(
        <Button variant="contained" color="error" onClick={pyatchVM?.stopAll.bind(pyatchVM)}><DangerousIcon/></Button>
    );
}