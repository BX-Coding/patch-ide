import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import Typography from '@mui/material/Typography';


export function PyatchSpriteAttributes(props) {
    const { pyatchVM } = useContext(pyatchContext);

    let spriteXVal = pyatchVM.editingTarget?.x;
    let spriteYVal = pyatchVM.editingTarget?.y;
    let spriteSizeVal = pyatchVM.editingTarget?.size;
    let spriteDirectionVal = pyatchVM.editingTarget?.direction;

    return(
        <Typography variant="h5" align = "center">X: {Math.round(spriteXVal)} Y: {Math.round(spriteYVal)} Size: {Math.round(spriteSizeVal)} Direction: {Math.round(spriteDirectionVal)} </Typography>
    );
}