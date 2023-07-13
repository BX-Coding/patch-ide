import React, { useContext, useEffect, useState } from 'react';
import pyatchContext from './provider/PyatchContext.js';

import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { autocompletion } from "@codemirror/autocomplete";
import { lintGutter } from "@codemirror/lint";
import pythonLinter from '../util/python-syntax-lint.js';
import { indentationMarkers } from '@replit/codemirror-indentation-markers';

import SplitPane, { Pane } from 'react-split-pane-next';

import { Autocomplete, Button, TextField, Grid } from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';

import completions from '../util/patch-autocompletions.mjs';

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
    const { setChangesSinceLastSave, pyatchVM, threadsText, setThreadsText, savedThreads, setSavedThreads, runtimeErrorList, handleSaveThread, broadcastMessageIds, setBroadcastMessageIds } = useContext(pyatchContext);
    const { thread, first, final, onAddThread, onDeleteThread } = props;
    const [triggerEvent, setTriggerEvent] = useState(thread.triggerEvent);
    const [triggerEventOption, setTriggerEventOption] = useState(thread.triggerEventOption);

    const handleSave = () => {
        handleSaveThread(thread);
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
        setBroadcastMessageIds({...broadcastMessageIds, [thread.id]: event.target.value})
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
                    extensions={[python(), autocompletion({override: [completions(pyatchVM.getPatchPythonApiInfo(), pyatchVM)]}), pythonLinter(console.log, pyatchVM, thread.id), lintGutter(), indentationMarkers()]}
                    theme="dark"
                    onChange={handleCodeChange}
                    height="calc(100vh - 164px)"
                />
            </Grid>
        </>
    );
}