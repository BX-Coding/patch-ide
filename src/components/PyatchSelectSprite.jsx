import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import Button from '@mui/material/Button';

export function PyatchSelectSprite(props) {
    const { pyatchEditor } = useContext(pyatchContext);
    // whenever the activeSpriteName changes, reload the buttons so the name changes automatically
    const { activeSpriteName } = useContext(pyatchContext);

    let spriteID = props.spriteID;

    let spriteName = pyatchEditor.getSpriteName(spriteID);

    return(
        <Button variant="contained" onClick={() => pyatchEditor.onSelectSprite(spriteID)}>{spriteName}</Button>
    );
}