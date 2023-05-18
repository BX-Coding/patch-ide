import React, { useContext } from 'react';
import { PyatchAddSprite } from './PyatchAddSprite.jsx';
import pyatchContext from './provider/PyatchContext.js';
import { PyatchSelectSprite } from './PyatchSelectSprite.jsx';
import { PyatchSpriteAttributes } from './PyatchSpriteAttributes.jsx';
import { PyatchSpriteName } from './PyatchSpriteName.jsx';

const PyatchSpriteArea = () => {
    let { sprites } = useContext(pyatchContext);

    return (
        <div>
            {sprites.map((sprite) => {
                return <PyatchSpriteName key={sprite} spriteID={sprite}/>
            })}

            <PyatchSpriteAttributes/>
            
            {sprites.map((sprite) => {
                return <PyatchSelectSprite key={sprite} spriteID={sprite}/>
            })}
            
            <PyatchAddSprite/>
        </div>
    );
}

export default PyatchSpriteArea