import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';


export function PyatchSpriteAttributes(props) {
    const { pyatchSpriteValues } = useContext(pyatchContext);

    let spriteXVal = pyatchSpriteValues[0];
    let spriteYVal = pyatchSpriteValues[1];
    let spriteSizeVal = pyatchSpriteValues[2];
    let spriteDirectionVal = pyatchSpriteValues[3];

    return(
        <h1>X: {Math.round(spriteXVal)} Y: {Math.round(spriteYVal)} Size: {Math.round(spriteSizeVal)} Direction: {Math.round(spriteDirectionVal)} </h1>
    );
}