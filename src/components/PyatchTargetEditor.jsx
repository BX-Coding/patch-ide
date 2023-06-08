import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import CodeMirror from '@uiw/react-codemirror';
import { material } from '@uiw/codemirror-theme-material';
import { python } from '@codemirror/lang-python';
import {autocompletion} from "@codemirror/autocomplete";
import SplitPane, { Pane } from 'react-split-pane-next';

import { Autocomplete, Button, TextField, Grid } from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';

export function PyatchTargetEditor(props) {
    const { pyatchEditor } = useContext(pyatchContext);
    const { editorText, eventLabels } = pyatchEditor;
    const { spriteID } = props;
    const spriteThreads = editorText[spriteID];


    const onAddThread = () => {
        spriteThreads.push({code:"", eventId: "event_whenflagclicked", option: ""});
        pyatchEditor.setEditorText(() => [...editorText]);
        pyatchEditor.setChangesSinceLastSave(true);
    }

    const onDeleteThread = (threadId) => {
        spriteThreads.splice(threadId, 1);
        pyatchEditor.setEditorText(() => [...editorText]);
        pyatchEditor.setChangesSinceLastSave(true);
    }

    return(
        <SplitPane split="vertical">
            {spriteThreads.map((thread, i) => 
            <Pane initialSize={`${Math.floor(1/spriteThreads.length * 100)}%`}>
                <ThreadEditor spriteId={spriteID} threadId={i} eventMap={eventLabels} first={i === 0} final={i === (spriteThreads.length - 1)} onAddThread={onAddThread} onDeleteThread={onDeleteThread}/>
            </Pane>)}
        </SplitPane>
    );
}

function ThreadEditor(props) {
    const { spriteId, threadId, eventMap, first, final, onAddThread, onDeleteThread } = props;
    const { pyatchEditor } = useContext(pyatchContext);
    const { editorText, getEventOptions } = pyatchEditor;
    const threadState = editorText[spriteId][threadId];

    const handleCodeChange = (newValue) => {
        threadState.code = newValue;
        pyatchEditor.setEditorText(() => [...editorText]);
        pyatchEditor.setChangesSinceLastSave(true);
    }

    const handleEventChange = (event, newValue) => {
        threadState.eventId = newValue.id;
        threadState.option = "";
        pyatchEditor.setEditorText(() => [...editorText]);
        pyatchEditor.setChangesSinceLastSave(true);
    }

    const handleEventOptionChange = (event, newValue) => {
        threadState.option = newValue.id;
        pyatchEditor.setEditorText(() => [...editorText]);
        pyatchEditor.setChangesSinceLastSave(true);
    }

    const handleEventOptionBroadcastChange = (event) => {
        threadState.option = event.target.value;
        pyatchEditor.setEditorText(() => [...editorText]);
        pyatchEditor.setChangesSinceLastSave(true);
    }

    const eventList = Object.keys(eventMap).map((event) => {return { id: event, label: eventMap[event] }});
    let eventOptionsList;
    if (threadState.eventId !== "event_whenbroadcastreceived") {
        eventOptionsList = (getEventOptions(threadState.eventId) ?? []).map((eventOption) => { return { id: eventOption, label: eventOption}});
    }
    return (
        <>
            <Grid display="flex" flexDirection="row" spacing={2}>
                <Autocomplete
                    disablePortal
                    disableClearable
                    id="event-thread-selection"
                    options={eventList}
                    defaultValue={{id: threadState.eventId, label: eventMap[threadState.eventId]}}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    hiddenLabel
                    onChange={handleEventChange}
                    variant="outlined"  
                    size="small"
                    fullWidth
                    sx={{ input: { color: 'white'}, fieldset: { borderColor: "white" }}}
                    renderInput={(params) => 
                        <TextField {...params}/>
                    }
                />
                {(eventOptionsList && eventOptionsList.length > 0) && <Autocomplete
                    disablePortal
                    disableClearable
                    id="event-thread-option-selection"
                    options={eventOptionsList}
                    defaultValue={{id: threadState.option, label: threadState.option}}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    hiddenLabel
                    onChange={handleEventOptionChange}
                    variant="outlined"  
                    size="small"
                    fullWidth
                    sx={{ input: { color: 'white'}, fieldset: { borderColor: "white" }}}
                    renderInput={(params) => 
                        <TextField {...params}/>
                    }
                />}
                {threadState.eventId === "event_whenbroadcastreceived" && <TextField
                    id="event-thread-broadcost-option-text-input"
                    onChange={handleEventOptionBroadcastChange}
                    defaultValue={threadState.option}
                    variant="outlined"  
                    size="small"
                    sx={{ input: { color: 'white'}, fieldset: { borderColor: "white" }}}
                />}
                {!first && <Button variant="contained" color="primary" onClick={() => onDeleteThread(threadId)}><DeleteIcon/></Button>}
                {final && <Button variant="contained" onClick={onAddThread}><PostAddIcon/></Button>}
            </Grid>
            <CodeMirror
                value={threadState.code}
                extensions={[python(), autocompletion({override: [completions]})]}
                theme="dark"
                onChange={handleCodeChange}
                height="70vh"
            />
        </>
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