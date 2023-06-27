import React, { useContext, useEffect, useState } from 'react';
import pyatchContext from './provider/PyatchContext.js';

import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { autocompletion } from "@codemirror/autocomplete";
import { lintGutter } from "@codemirror/lint";
import pythonLinter from '../util/python-syntax-lint.js';

import SplitPane, { Pane } from 'react-split-pane-next';

import { Autocomplete, Button, TextField, Grid } from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

export function PyatchTargetEditor(props) {
    const { pyatchVM, setChangesSinceLastSave, editingTargetId } = useContext(pyatchContext);
    const [ editingThreadIds, setEditingThreadsIds ] = useState(Object.keys(pyatchVM.editingTarget.threads));
    const { target } = props;


    const onAddThread = () => {
        target.addThread("", "event_whenflagclicked", "");
        setEditingThreadsIds(Object.keys(pyatchVM.editingTarget.threads));
        setChangesSinceLastSave(true);
    }

    const onDeleteThread = (threadId) => () => {
        target.deleteThread(threadId);
        setEditingThreadsIds(Object.keys(pyatchVM.editingTarget.threads));
        setChangesSinceLastSave(true);
    }

    useEffect(() => {
        setEditingThreadsIds(Object.keys(pyatchVM.editingTarget.threads));
    }, [editingTargetId]);

    return(
        <SplitPane split="vertical">
            {editingThreadIds.map((threadId, i) => 
            <Pane initialSize={`${100/editingThreadIds.length}%`}>
                <ThreadEditor thread={pyatchVM.editingTarget.getThread(threadId)} first={i === 0} final={i === (editingThreadIds.length - 1)} onAddThread={onAddThread} onDeleteThread={onDeleteThread(threadId)}/>
            </Pane>)}
        </SplitPane>
    );
}

function ThreadEditor(props) {
    const { setChangesSinceLastSave, pyatchVM, threadsText, setThreadsText, savedThreads, setSavedThreads } = useContext(pyatchContext);
    const { thread, first, final, onAddThread, onDeleteThread } = props;
    const [triggerEvent, setTriggerEvent] = useState(thread.triggerEvent);
    const [triggerEventOption, setTriggerEventOption] = useState(thread.triggerEventOption);

    const handleSave = () => {
        thread.updateThreadScript(threadsText[thread.id]);
        setSavedThreads({...savedThreads, [thread.id]: true});
    }

    const handleCodeChange = (newValue) => {
        setThreadsText({...threadsText, [thread.id]: newValue});
        setSavedThreads({...savedThreads, [thread.id]: false});
        setChangesSinceLastSave(true);
    }

    const handleEventChange = (event, newValue) => {
        thread.updateThreadTriggerEvent(newValue.id)
        setTriggerEvent(newValue.id);
        setChangesSinceLastSave(true);
    }
    
    const handleEventOptionChange = (event, newValue) => {
        thread.updateThreadTriggerEventOption(newValue.id)
        setTriggerEventOption(newValue.id);
        setChangesSinceLastSave(true);
    }

    const handleEventOptionBroadcastChange = (event) => {
        thread.updateThreadTriggerEventOption(event.target.value);
        setChangesSinceLastSave(true);
    }

    const eventMap = pyatchVM.getEventLabels();
    const eventList = Object.keys(eventMap).map((event) => {return { id: event, label: eventMap[event] }});
    let eventOptionsList;
    if (thread.triggerEvent !== "event_whenbroadcastreceived") {
        eventOptionsList = (pyatchVM.getEventOptionsMap(triggerEvent) ?? []).map((eventOption) => { return { id: eventOption, label: eventOption}});
    }
    return (
        <>
            <Grid display="flex" flexDirection="row" spacing={2} marginTop="4px">
                <Autocomplete
                    disablePortal
                    disableClearable
                    id="event-thread-selection"
                    options={eventList}
                    defaultValue={{id: thread.triggerEvent, label: eventMap[thread.triggerEvent]}}
                    isOptionEqualToValue={(option, value) => option.id === value.id}
                    hiddenLabel
                    onChange={handleEventChange}
                    variant="outlined"  
                    size="small"
                    fullWidth
                    sx={{ input: { color: 'white'}, fieldset: { borderColor: "white" }}}
                    componentsProps={{
                        paper: {
                          sx: {
                            width: 400
                          }
                        }
                      }}
                    renderInput={(params) => 
                        <TextField {...params}/>
                    }
                />
                {(eventOptionsList && eventOptionsList.length > 0) && <Autocomplete
                    disablePortal
                    disableClearable
                    id="event-thread-option-selection"
                    options={eventOptionsList}
                    defaultValue={{id: thread.triggerEventOption, label: thread.triggerEventOption}}
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
                {thread.triggerEvent === "event_whenbroadcastreceived" && <TextField
                    id="event-thread-broadcost-option-text-input"
                    onChange={handleEventOptionBroadcastChange}
                    defaultValue={thread.triggerEventOption}
                    variant="outlined"  
                    size="small"
                    sx={{ input: { color: 'white'}, fieldset: { borderColor: "white" }}}
                />}
                <Button variant="contained" color="success" onClick={handleSave} disabled={savedThreads[thread.id]}><SaveIcon/></Button>
                {!first && <Button variant="contained" color="primary" onClick={onDeleteThread}><DeleteIcon/></Button>}
                {final && <Button variant="contained" onClick={onAddThread}><PostAddIcon/></Button>}
            </Grid>
            <Grid marginTop="4px">
                <CodeMirror
                    value={thread.script}
                    extensions={[python(), autocompletion({override: [completions]}), pythonLinter(console.log), lintGutter()]}
                    theme="dark"
                    onChange={handleCodeChange}
                    height="calc(100vh - 164px)"
                />
            </Grid>
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