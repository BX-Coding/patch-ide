import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import Button from '@mui/material/Button';

export function PyatchSelectSprite(props) {
    const { pyatchEditor } = useContext(pyatchContext);

    let spriteID = props.spriteID;

    return(
        <Button variant="contained" onClick={() => pyatchEditor.onSelectSprite(spriteID)}>Sprite {spriteID}</Button>
    );
}