import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';


export function PyatchSpriteAttributes(props) {
    const { pyatchSpriteValues } = useContext(pyatchContext);

    let spriteXVal = pyatchSpriteValues["spriteX"][0];
    let spriteYVal = pyatchSpriteValues["spriteY"][0];
    let spriteSizeVal = pyatchSpriteValues["spriteSize"][0];
    let spriteDirectionVal = pyatchSpriteValues["spriteDirection"][0];

    return(
        <h1>X: {spriteXVal} Y: {spriteYVal} Size: {spriteSizeVal} Direction: {spriteDirectionVal} </h1>
    );
}