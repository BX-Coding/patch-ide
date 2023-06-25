import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import pyatchContext from './provider/PyatchContext.js';
import Grid from '@mui/material/Grid';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';

export function PyatchDeleteSprite(props) {
    const { editingTargetId, onDeleteSprite } = useContext(pyatchContext);

    return(
        <Grid container justifyContent="center">
            <Button variant="contained" onClick={()=>onDeleteSprite(editingTargetId)} sx={{m:"1vh"}}><DeleteOutlineIcon/></Button>
        </Grid>
    );
}