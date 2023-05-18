import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import { PyatchTargetEditor } from './PyatchTargetEditor.jsx';

const PyatchEditor = () => {
    let { sprites } = useContext(pyatchContext);
    
    return (
        <div>
            {sprites.map((sprite) => {
                return <PyatchTargetEditor key={sprite} spriteID={sprite}/>
            })}
        </div>
    );
}

export default PyatchEditor