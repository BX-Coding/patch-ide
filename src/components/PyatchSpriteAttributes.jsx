import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import Typography from '@mui/material/Typography';


export function PyatchSpriteAttributes(props) {
    const { pyatchSpriteValues } = useContext(pyatchContext);

    let spriteXVal = pyatchSpriteValues.x;
    let spriteYVal = pyatchSpriteValues.y;
    let spriteSizeVal = pyatchSpriteValues.size;
    let spriteDirectionVal = pyatchSpriteValues.direction;

    return(
        <Typography variant="h5" align = "center">X: {Math.round(spriteXVal)} Y: {Math.round(spriteYVal)} Size: {Math.round(spriteSizeVal)} Direction: {Math.round(spriteDirectionVal)} </Typography>
    );
}