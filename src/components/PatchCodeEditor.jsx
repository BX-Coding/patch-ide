import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import { PyatchTargetEditor } from './PyatchTargetEditor.jsx';
import CodeMirror from '@uiw/react-codemirror';
import { material } from '@uiw/codemirror-theme-material';
import { python } from '@codemirror/lang-python';
import { Typography } from '@mui/material';

const PyatchEditor = () => {
    const { pyatchVM } = useContext(pyatchContext);
    const targets = pyatchVM.getAllRenderedTargets();
    return (targets.length===0 ? <NoSprites/> : <FilteredTargetEditor/>);
}

function NoSprites(){
    return(
        <Typography>No Sprite Selected</Typography>
    );
}

function FilteredTargetEditor(){
    let { pyatchVM } = useContext(pyatchContext);
    return(
        <PyatchTargetEditor key={pyatchVM.editingTarget.id} target={pyatchVM.editingTarget}/>
    );
}

export default PyatchEditor;
