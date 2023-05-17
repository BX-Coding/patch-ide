import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import CodeMirror from '@uiw/react-codemirror';
import { material } from '@uiw/codemirror-theme-material';
import { python } from '@codemirror/lang-python';

export function PyatchCodeEditor(props) {
    const { pyatchEditor } = useContext(pyatchContext);
    const { pyatchSetActiveSprite } = useContext(pyatchContext);

    let activeSprite = pyatchSetActiveSprite["activeSprite"][0];

    const updateState = (newValue) => {
        console.log(activeSprite);
        pyatchEditor.editorText[activeSprite] = newValue;
    }

    return(
        <CodeMirror
            value={pyatchEditor.editorText[activeSprite]}
            extensions={[python()]}
            theme={material}
            onChange={updateState}
            height="90vh"
        />
    );
}