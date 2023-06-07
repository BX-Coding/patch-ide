import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import { PyatchTargetEditor } from './PyatchTargetEditor.jsx';
import CodeMirror from '@uiw/react-codemirror';
import { material } from '@uiw/codemirror-theme-material';
import { python } from '@codemirror/lang-python';

const PyatchEditor = () => {
    let { sprites } = useContext(pyatchContext);
    return ((Object.keys(sprites).length===1) ? <NoSprites/> : <FilteredTargetEditor/>);
}

function NoSprites(){
    return(
        <CodeMirror
            value={""}
            extensions={[python()]}
            theme={material}
            height="90vh"
        />
    );
}

function FilteredTargetEditor(){
    let { sprites } = useContext(pyatchContext);
    const { activeSprite } = useContext(pyatchContext);
    const filteredSprites = sprites.filter((sprite) => sprite === activeSprite);
    return(
        <>
            {filteredSprites.map((sprite) => <PyatchTargetEditor key={sprite} spriteID={sprite}/>)}
        </>
    );
}

export default PyatchEditor;
