import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';


export function PyatchSpriteAttributes(props) {
    const { pyatchSpriteValues } = useContext(pyatchContext);

    let spriteXVal = pyatchSpriteValues.x;
    let spriteYVal = pyatchSpriteValues.y;
    let spriteSizeVal = pyatchSpriteValues.size;
    let spriteDirectionVal = pyatchSpriteValues.direction;

    return(
        <h1>X: {Math.round(spriteXVal)} Y: {Math.round(spriteYVal)} Size: {Math.round(spriteSizeVal)} Direction: {Math.round(spriteDirectionVal)} </h1>
    );
}