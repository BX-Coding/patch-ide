import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import pyatchContext from './provider/PyatchContext.js';
import AddIcon from '@mui/icons-material/Add';

export function PyatchAddSprite(props) {
    const { pyatchEditor } = useContext(pyatchContext);

    return(
        <Button variant="contained" onClick={pyatchEditor.onAddSprite} disabled={pyatchEditor.addSpriteDisabled}><AddIcon/></Button>
    );
}