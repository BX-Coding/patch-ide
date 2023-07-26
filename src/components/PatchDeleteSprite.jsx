import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import pyatchContext from './provider/PyatchContext.js';
import Grid from '@mui/material/Grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Runtime from 'pyatch-vm/src/engine/runtime.mjs';

import { PatchDeleteButton } from './PatchTemplates.jsx';

export function PyatchDeleteSprite(props) {
    const { targetIds, editingTargetId, onDeleteSprite, pyatchVM } = useContext(pyatchContext);

    return (
        <PatchDeleteButton red={true} disabled={targetIds[0] == editingTargetId} onClick={() => { onDeleteSprite(editingTargetId); }} />
    );
}