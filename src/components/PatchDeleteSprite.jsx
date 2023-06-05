import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import pyatchContext from './provider/PyatchContext.js';
import ClearIcon from '@mui/icons-material/Clear';
import Grid from '@mui/material/Grid';

export function PyatchDeleteSprite(props) {
    const { pyatchEditor } = useContext(pyatchContext);
    const { activeSprite } = useContext(pyatchContext);

    return(
        <Grid container justifyContent="center">
            <Button variant="contained" onClick={()=>pyatchEditor.onDeleteSprite(activeSprite)} sx={{m:"1vh"}}><ClearIcon/></Button>
        </Grid>
    );
}