import React, { useContext, useState, useEffect } from 'react';
import { VariableEditor } from './VariableEditor';
import { CodeEditor } from './CodeEditor';
import { SpriteEditor } from './SpriteEditor';
import { SoundEditor } from './SoundEditor';

import Button from '@mui/material/Button'

import usePatchStore, { EditorTab } from '../../store';


export function EditorPane() {
    const patchEditorTab = usePatchStore((state) => state.editorTab)

    return <div className="tabContent" style={{
    }}>
        {patchEditorTab === EditorTab.CODE && <CodeEditor/>}
        {patchEditorTab === EditorTab.COSTUMES && <SpriteEditor/>}
        {patchEditorTab === EditorTab.SOUNDS && <SoundEditor/>}
        {patchEditorTab === EditorTab.VARIABLES && <VariableEditor/>}
    </div>
}

export function EditorTabButton(tab: EditorTab) {
    const editorTab = usePatchStore((state) => state.editorTab)
    const setEditorTab = usePatchStore((state) => state.setEditorTab)

    const updateEditorTab = () => {
        setEditorTab(tab);
    }

    const variant = editorTab === tab ? "contained" : "outlined";

    return <Button variant={variant} onClick={updateEditorTab}></Button>
}