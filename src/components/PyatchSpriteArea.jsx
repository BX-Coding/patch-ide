import React, { useContext } from 'react';
import { PyatchAddSprite } from './PyatchAddSprite.jsx';
import pyatchContext from './provider/PyatchContext.js';
import { PyatchSelectSprite } from './PyatchSelectSprite.jsx';
import { PyatchSpriteAttributes } from './PyatchSpriteAttributes.jsx';

const PyatchSpriteArea = () => {
    let { sprites } = useContext(pyatchContext);

    return (
        <div>
            <PyatchSpriteAttributes/>
            
            {sprites.map((sprite) => {
                return <PyatchSelectSprite key={sprite} spriteID={sprite}/>
            })}
            
            <PyatchAddSprite/>
        </div>
    );
}

export default PyatchSpriteArea