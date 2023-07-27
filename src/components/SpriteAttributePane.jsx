import React, { useContext } from 'react';
import patchContext from './provider/PatchContext.js';
import Typography from '@mui/material/Typography';


export function SpriteAttributePane(props) {
    const { pyatchVM } = useContext(patchContext);
    const editingTarget = pyatchVM ? pyatchVM.editingTarget : null;

    let spriteXVal = editingTarget?.x;
    let spriteYVal = editingTarget?.y;
    let spriteSizeVal = editingTarget?.size;
    let spriteDirectionVal = editingTarget?.direction;

    return(
        <Typography variant="h5" align = "center">X: {Math.round(spriteXVal)} Y: {Math.round(spriteYVal)} Size: {Math.round(spriteSizeVal)} Direction: {Math.round(spriteDirectionVal)} </Typography>
    );
}