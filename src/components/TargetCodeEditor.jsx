import React, { useContext, useEffect, useState } from 'react';
import patchContext from './provider/PatchContext.js';

import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { autocompletion } from "@codemirror/autocomplete";
import { lintGutter } from "@codemirror/lint";
import pythonLinter from '../util/python-syntax-lint.js';
import { indentationMarkers } from '@replit/codemirror-indentation-markers';

import SplitPane, { Pane } from 'react-split-pane-next';

import { Autocomplete, Button, TextField, Grid } from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SaveIcon from '@mui/icons-material/Save';

import { DeleteButton, HorizontalButtons, IconButton } from './PatchButtons.jsx';
import completions from '../util/patch-autocompletions.mjs';

export function TargetCodeEditor(props) {
    const { pyatchVM, setProjectChanged, editingTargetId } = useContext(patchContext);
    const [ editingThreadIds, setEditingThreadsIds ] = useState(Object.keys(pyatchVM.editingTarget.threads));
    const { target } = props;


    const onAddThread = () => {
        target.addThread("", "event_whenflagclicked", "");
        setEditingThreadsIds(Object.keys(pyatchVM.editingTarget.threads));
        setProjectChanged(true);
    }

    const onDeleteThread = (threadId) => () => {
        target.deleteThread(threadId);
        setEditingThreadsIds(Object.keys(pyatchVM.editingTarget.threads));
        setProjectChanged(true);
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
    const { setProjectChanged, pyatchVM, threadsText, setThreadsText, savedThreads, setSavedThreads, handleSaveThread, broadcastMessageIds, setBroadcastMessageIds, editingTargetId } = useContext(patchContext);
    const { thread, first, final, onAddThread, onDeleteThread } = props;
    const [triggerEvent, setTriggerEvent] = useState(thread.triggerEvent);
    const [triggerEventOption, setTriggerEventOption] = useState(thread.triggerEventOption);

    const handleSave = () => {
        handleSaveThread(thread);
    }

    const handleCodeChange = (newValue) => {
        setThreadsText({...threadsText, [thread.id]: newValue});
        setSavedThreads({...savedThreads, [thread.id]: false});
        setProjectChanged(true);
    }

    const handleEventChange = (event, newValue) => {
        thread.updateThreadTriggerEvent(newValue.id)
        // This Sprite Clicked has an implicit option of "this sprite"
        if (newValue.id === "event_whenthisspriteclicked") {
            thread.updateThreadTriggerEventOption(editingTargetId)
        } else {
            thread.updateThreadTriggerEventOption("");
        }
        setTriggerEvent(newValue.id);
        setProjectChanged(true);
    }
    
    const handleEventOptionChange = (event, newValue) => {
        thread.updateThreadTriggerEventOption(newValue.id)
        setTriggerEventOption(newValue.id);
        setProjectChanged(true);
    }

    const handleEventOptionBroadcastChange = (event) => {
        thread.updateThreadTriggerEventOption(event.target.value);
        setBroadcastMessageIds({...broadcastMessageIds, [thread.id]: event.target.value})
        setProjectChanged(true);
    }

    const eventMap = pyatchVM.getEventLabels();
    const eventList = Object.keys(eventMap).map((event) => {return { id: event, label: eventMap[event] }});
    let eventOptionsList;
    if (thread.triggerEvent !== "event_whenbroadcastreceived") {
        eventOptionsList = (pyatchVM.getEventOptionsMap(triggerEvent) ?? []).map((eventOption) => { return { id: eventOption, label: eventOption}});
    }
    return (
        <>
            <Grid container direction="row" spacing={"1px"}>
                <Grid item xs>
                    <Autocomplete
                        disablePortal
                        disableClearable
                        id="event-thread-selection"
                        options={eventList}
                        defaultValue={{ id: thread.triggerEvent, label: eventMap[thread.triggerEvent] }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        hiddenLabel
                        onChange={handleEventChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ backgroundColor: 'panel.default' }}
                        componentsProps={{
                            paper: {
                                sx: {
                                    width: 400
                                }
                            }
                        }}
                        renderInput={(params) =>
                            <TextField {...params} />
                        }
                    />
                </Grid>
                <Grid item>
                    {(eventOptionsList && eventOptionsList.length > 0) && <Autocomplete
                        disablePortal
                        disableClearable
                        id="event-thread-option-selection"
                        options={eventOptionsList}
                        defaultValue={{ id: thread.triggerEventOption, label: thread.triggerEventOption }}
                        isOptionEqualToValue={(option, value) => option.id === value.id}
                        hiddenLabel
                        onChange={handleEventOptionChange}
                        variant="outlined"
                        size="small"
                        fullWidth
                        sx={{ backgroundColor: 'panel.default' }}
                        renderInput={(params) =>
                            <TextField {...params} />
                        }
                    />}
                </Grid>
                <Grid item>
                    {thread.triggerEvent === "event_whenbroadcastreceived" && <TextField
                        id="event-thread-broadcost-option-text-input"
                        onChange={handleEventOptionBroadcastChange}
                        defaultValue={thread.triggerEventOption}
                        variant="outlined"
                        size="small"
                    />}
                </Grid>
                <Grid item sx={{ width: (/* !first XOR final */ !first ^ final) ? 134 : ((!first && final) ? 198 : 68), padding: 0 }}>
                    <HorizontalButtons spacing={"2px"} sx={{maxHeight: 40}}>
                        <IconButton color="success" onClick={handleSave} disabled={savedThreads[thread.id]} sx={{ height: 40 }} icon={<SaveIcon />} />
                        {!first && <DeleteButton onClick={onDeleteThread} sx={{height: 40}} />}
                        {final && <IconButton onClick={onAddThread} icon={<PostAddIcon />} sx={{height: 40}} />}
                    </HorizontalButtons>
                </Grid>
            </Grid>
            <Grid marginTop="4px">
                <CodeMirror
                    value={threadsText[thread.id]}
                    extensions={[python(), autocompletion({override: [completions(pyatchVM)]}), pythonLinter(console.log, pyatchVM, thread.id), lintGutter(), indentationMarkers()]}
                    theme="dark"
                    onChange={handleCodeChange}
                    height="calc(100vh - 169px)"
                />
            </Grid>
        </>
    );
}