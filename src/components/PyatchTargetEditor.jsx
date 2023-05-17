import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import CodeMirror from '@uiw/react-codemirror';
import { material } from '@uiw/codemirror-theme-material';
import { python } from '@codemirror/lang-python';

export function PyatchTargetEditor(props) {
    const { pyatchEditor } = useContext(pyatchContext);
    const { activeSprite } = useContext(pyatchContext);

    const updateState = (newValue) => {
        if (activeSprite == props.spriteID) {
            pyatchEditor.editorText[props.spriteID] = newValue;
        }
    }

    const active = {
        'pointer-events': 'auto',
        'opacity': '1'
    };

    const inactive = {
        'pointer-events': 'none',
        'opacity': '0'
    };

    return(
        <div style={(activeSprite == props.spriteID) ? active : inactive}>
            <CodeMirror
                value={pyatchEditor.editorText[props.spriteID]}
                extensions={[python()]}
                theme={material}
                onChange={updateState}
                height="90vh"
            />
        </div>
    );
}