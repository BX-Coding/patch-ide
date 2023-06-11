import React, { useContext } from 'react';
import Button from '@mui/material/Button'
import pyatchContext from './provider/PyatchContext.js';
import PatchVariables from './PatchVariables.jsx';
import PatchErrorWindow from './PatchErrorWindow.jsx';
import Grid from '@mui/material/Grid';

import DataObjectIcon from '@mui/icons-material/DataObject';
import FlutterDashIcon from '@mui/icons-material/FlutterDash';

export function PatchEditor(props) {
    const { patchEditorTab } = useContext(pyatchContext);

    return ([<PatchCodeEditorTab/>, <PatchSpriteEditorTab/>][patchEditorTab])
}

export function PatchCodeEditorTabButton(props) {
    const { patchEditorTab, setPatchEditorTab } = useContext(pyatchContext);

    const updateEditorTab = () => {
        setPatchEditorTab(0);
    }

    return(
        <Button variant={patchEditorTab === 0 ? "contained" : "outlined"} onClick={updateEditorTab}><DataObjectIcon/></Button>
    );
}

export function PatchSpriteEditorTabButton(props) {
    const { patchEditorTab, setPatchEditorTab } = useContext(pyatchContext);

    const updateEditorTab = () => {
        setPatchEditorTab(1);
    }

    return(
        <Button variant={patchEditorTab === 1 ? "contained" : "outlined"} onClick={updateEditorTab}><FlutterDashIcon/></Button>
    );
}

function PatchCodeEditorTab(props) {
    return(
        <div className = "scrollEffect">
            <Grid><PatchVariables/></Grid>
            <Grid><PatchErrorWindow/></Grid>
        </div>
    );
}

function PatchSpriteEditorTab(props) {
    return(
        "hello"
    );
}