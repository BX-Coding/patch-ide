import React, { useContext } from 'react';
import { Button } from '@uiw/react-codemirror'
import pyatchContext from './pyatchContext';

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