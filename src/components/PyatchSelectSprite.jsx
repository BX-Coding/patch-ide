import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';

export function PyatchSelectSprite(props) {
    const { pyatchEditor } = useContext(pyatchContext);
    // whenever the activeSpriteName changes, reload the buttons so the name changes automatically
    const { activeSpriteName } = useContext(pyatchContext);

    const { activeSprite } = useContext(pyatchContext);

    let spriteID = props.spriteID;

    let spriteName = pyatchEditor.getSpriteName(spriteID);

    return(
        <Button variant={spriteID == activeSprite ? "contained" : "outlined"} onClick={() => pyatchEditor.onSelectSprite(spriteID)} sx={{m:"1vh"}}>{spriteName}</Button>
    );
}