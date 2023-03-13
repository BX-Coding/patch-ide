import React, { useContext } from 'react';
import { Button } from '@mui/material'

export function PyatchStartButton(props) {
    const pyatch = useContext(pyatchContext);

    return(
        <Button variant="contained" onClick={pyatch.onStart} disabled={pyatch.startDisabled}>Start</Button>
    );
}

export function PyatchStopButton(props) {
    const pyatch = useContext(pyatchContext);

    return(
        <Button variant="outlined" color="error" onClick={pyatch.onStop} disabled={pyatch.stopDisabled}>Stop</Button>
    );
}