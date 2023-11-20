import React, { useContext, useState } from 'react';
import Button from '@mui/material/Button'
import FlagIcon from '@mui/icons-material/Flag';
import DangerousIcon from '@mui/icons-material/Dangerous';
import usePatchStore from '../../store';

export function StartButton() {
    const patchVM = usePatchStore((state) => state.patchVM);
    const saveAllThreads = usePatchStore((state) => state.saveAllThreads);
    const clearRuntimeDiagnostics = usePatchStore((state) => state.clearRuntimeDiagnostics);
    const [ runButtonDisabled, setRunButtonDisabled ] = useState(false);

    const onFlagPressed = async () => {
        clearRuntimeDiagnostics();
        await saveAllThreads();
        setRunButtonDisabled(true);
        await patchVM.greenFlag();
        setRunButtonDisabled(false);
      }

    return(
        <Button variant="contained" onClick={onFlagPressed} disabled={runButtonDisabled}><FlagIcon/></Button>
    );
}

export function StopButton() {
    const patchVM = usePatchStore((state) => state.patchVM);

    return(
        <Button variant="contained" color="error" onClick={patchVM?.stopAll.bind(patchVM)}><DangerousIcon/></Button>
    );
}