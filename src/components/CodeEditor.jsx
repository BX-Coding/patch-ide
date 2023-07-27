import React, { useContext } from 'react';
import patchContext from './provider/PatchContext.js';
import { TargetCodeEditor } from './TargetCodeEditor.jsx';
import { Typography } from '@mui/material';

const CodeEditor = () => {
    const { pyatchVM } = useContext(patchContext);
    const targets = pyatchVM ? pyatchVM.getAllRenderedTargets() : [];
    return (targets.length===0 ? <NoSprites/> : <FilteredTargetEditor/>);
}

function NoSprites(){
    return(
        <Typography>No Sprite Selected</Typography>
    );
}

function FilteredTargetEditor(){
    let { pyatchVM, editingTargetId } = useContext(patchContext);
    return<>
        {editingTargetId && <TargetCodeEditor key={editingTargetId} target={pyatchVM.editingTarget}/>}
    </>;
}

export default CodeEditor;
