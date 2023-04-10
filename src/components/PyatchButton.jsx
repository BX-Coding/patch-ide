import React, { useContext } from 'react';
import { Button } from '@mui/material/Button'
import pyatchContext from './pyatchContext.js';

export function PyatchStartButton(props) {
    const pyatchEditor = useContext(pyatchContext);

    return(
        <Button variant="contained" onClick={pyatchEditor.onRunPress} disabled={pyatchEditor.buttonStates.runDisabled}>Run</Button>
    );
}

// export function PyatchStopButton(props) {
//     const { pyatch: pyatchEditor } = useContext(pyatchContext);

//     return(
//         <Button variant="outlined" color="error" onClick={pyatchEditor.onStop} disabled={pyatchEditor.stopDisabled}>Stop</Button>
//     );
// }