import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import CodeMirror from '@uiw/react-codemirror';
import { material } from '@uiw/codemirror-theme-material';
import { python } from '@codemirror/lang-python';
import {autocompletion} from "@codemirror/autocomplete";

export function PyatchTargetEditor(props) {
    const { pyatchEditor } = useContext(pyatchContext);
    const { activeSprite } = useContext(pyatchContext);

    const updateState = (newValue) => {
        if (activeSprite == props.spriteID) {
            pyatchEditor.editorText[props.spriteID] = newValue;
        }
    }

    const active = {
        'pointerEvents': 'auto',
        'opacity': '1',
        'position': 'relative'
    };

    const inactive = {
        'pointerEvents': 'none',
        'opacity': '0',
        'position': 'absolute'
    };

    return(
        <div style={(activeSprite == props.spriteID) ? active : inactive}>
            <CodeMirror
                value={pyatchEditor.editorText[props.spriteID]}
                extensions={[python(), autocompletion({override: [completions]})]}
                theme={material}
                onChange={updateState}
                height="90vh"
            />
        </div>
    );
}

function completions(context){
    let word = context.matchBefore(/\w*/);
    if (word.length>0)
        return {options:[{autoCloseBrackets: true}]};
    if (word.from == word.to)
        return null;
    return {
        from: word.from,
        options: [
        {label: "whenTouchingObject", detail: "(target)"},
        {label: "broadcast", detail: "(message)"},
        {label: "broadcastAndWait", detail: "(message)"},
        {label: "whenGreaterThan", detail: "(target, value)"},
        {label: "say", detail: "(message)"},
        {label: "sayFor", detail: "(message, seconds)"},
        {label: "think", detail: "(message)"},
        {label: "thinkFor", detail: "(message, seconds)"},
        {label: "show", detail: "()"},
        {label: "hide", detail: "()"},
        {label: "setCostumeTo", detail: "(costume)"},
        {label: "setBackdropTo", detail: "(backdrop)"},
        {label: "setBackdropToAndWait", detail: "(backdrop)"},
        {label: "nextCostume", detail: "()"},
        {label: "nextBackdrop", detail: "()"},
        {label: "changeGraphicEffectBy", detail: "(effect, change)"},
        {label: "setGraphicEffectTo", detail: "(effect, value)"},
        {label: "clearGraphicEffects", detail: "()"},
        {label: "changeSizeBy", detail: "(change)"},
        {label: "setSizeTo", detail: "(size)"},
        {label: "setLayerTo", detail: "(front or back)"},
        {label: "changeLayerBy", detail: "(number)"},
        {label: "getSize", detail: "()"},
        {label: "getCostume", detail: "()"},
        {label: "getBackdrop", detail: "()"},
        {label: "move", detail: "(steps)"},
        {label: "goToXY", detail: "(x, y)"},
        {label: "goTo", detail: "(targetName)"},
        {label: "turnRight", detail: "(degrees)"},
        {label: "turnLeft", detail: "(degrees)"},
        {label: "pointInDirection", detail: "(degrees)"},
        {label: "pointTowards", detail: "(targetName)"},
        {label: "glide", detail: "(seconds, x, y)"},
        {label: "glideTo", detail: "(seconds, targetName)"},
        {label: "ifOnEdgeBounce", detail: "()"},
        {label: "setRotationStyle", detail: "(style)"},
        {label: "changeX", detail: "(change in x)"},
        {label: "changeY", detail: "(change in y)"},
        {label: "setY", detail: "(y)"},
        {label: "setX", detail: "(x)"},
        {label: "getX", detail: "()"},
        {label: "getY", detail: "()"},
        {label: "getDirection", detail: "()"},
        {label: "playSound", detail: "(sound)"},
        {label: "playSoundUntilDone", detail: "(sound)"},
        {label: "stopAllSounds", detail: "()"},
        {label: "setSoundEffectTo", detail: "(sound, value)"},
        {label: "changeSoundEffectBy", detail: "(sound, value)"},
        {label: "clearSoundEffects", detail: "()"},
        {label: "setVolumeTo", detail: "(volume)"},
        {label: "changeVolumeBy", detail: "(volume)"},
        {label: "getVolume", detail: "()"}
        ]
    };
}