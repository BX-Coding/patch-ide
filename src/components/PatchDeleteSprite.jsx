import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import pyatchContext from './provider/PyatchContext.js';
import Grid from '@mui/material/Grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Runtime from 'pyatch-vm/src/engine/runtime.mjs';

export function PyatchDeleteSprite(props) {
    const { targetIds, editingTargetId, onDeleteSprite, pyatchVM } = useContext(pyatchContext);

    return (
        <Grid container justifyContent="center">
            <Button variant="contained" disabled={targetIds[0] == editingTargetId} onClick={() => { onDeleteSprite(editingTargetId); }} sx={{ m: "1vh" }}><DeleteOutlineIcon /></Button>
        </Grid>
    );
}