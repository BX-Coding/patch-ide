import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import pyatchContext from './provider/PyatchContext.js';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';

export function PyatchAddSprite(props) {
    const { pyatchEditor } = useContext(pyatchContext);

    return(
        <Grid container justifyContent="center">
            <Button variant="contained" onClick={pyatchEditor.onAddSprite} disabled={pyatchEditor.addSpriteDisabled} sx={{m:"1vh"}}><AddIcon/></Button>
        </Grid>
    );
}