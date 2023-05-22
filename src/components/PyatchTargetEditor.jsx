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
                extensions={[python(), autocompletion({override: [theCompletions]})]}
                theme={material}
                onChange={updateState}
                height="90vh"
            />
        </div>
    );
}

function theCompletions(context){
    let word = context.matchBefore(/\w*/);
    if (word.from == word.to && !context.explicit && (word.length>0))
        return {options:[{autoCloseBrackets: true}]}
    if (word.from == word.to && !context.explicit)
        return null
    return {
        from: word.from,
        options: [
        {label: "touchingObject", detail: "event"},
        {label: "broadcast", detail: "event"},
        {label: "broadCastAndWait", detail: "event"},
        {label: "hatGreaterThanPredicate", detail: "event"},
        {label: "say", detail: "look"},
        {label: "sayForSecs", detail: "look"},
        {label: "think", detail: "look"},
        {label: "thinkForSecs", detail: "look"},
        {label: "show", detail: "look"},
        {label: "hide", detail: "look"},
        {label: "switchCostume", detail: "look"},
        {label: "switchBackdrop", detail: "look"},
        {label: "switchBackdropAndWait", detail: "look"},
        {label: "nextCostume", detail: "look"},
        {label: "nextBackdrop", detail: "look"},
        {label: "changeEffect", detail: "look"},
        {label: "setEffect", detail: "look"},
        {label: "clearEffects", detail: "look"},
        {label: "changeSize", detail: "look"},
        {label: "setSize", detail: "look"},
        {label: "goToFrontBack", detail: "look"},
        {label: "goForwardBackwardLayers", detail: "look"},
        {label: "getSize", detail: "look"},
        {label: "getCostumeNumberName", detail: "look"},
        {label: "getBackdropNumberName", detail: "look"},
        {label: "moveSteps", detail: "motion"},
        {label: "goToXY", detail: "motion"},
        {label: "goTo", detail: "motion"},
        {label: "turnRight", detail: "motion"},
        {label: "turnLeft", detail: "motion"},
        {label: "pointInDirection", detail: "motion"},
        {label: "pointTowards", detail: "motion"},
        {label: "glide", detail: "motion"},
        {label: "glideTo", detail: "motion"},
        {label: "ifOnEdgeBounce", detail: "motion"},
        {label: "setRotationStyle", detail: "motion"},
        {label: "changeX", detail: "motion"},
        {label: "changeY", detail: "motion"},
        {label: "setY", detail: "motion"},
        {label: "setX", detail: "motion"},
        {label: "getX", detail: "motion"},
        {label: "getY", detail: "motion"},
        {label: "getDirection", detail: "motion"},
        {label: "playSound", detail: "sound"},
        {label: "playSoundAndWait", detail: "sound"},
        {label: "stopAllSounds", detail: "sound"},
        {label: "setEffectTo", detail: "sound"},
        {label: "changeEffectBy", detail: "sound"},
        {label: "clearEffects", detail: "sound"},
        {label: "soundsMenu", detail: "sound"},
        {label: "beatsMenu", detail: "sound"},
        {label: "effectsMenu", detail: "sound"},
        {label: "setVolumeTo", detail: "sound"},
        {label: "changeVolumeBy", detail: "sound"},
        {label: "getVolume", detail: "sound"}
        ]
    }
}