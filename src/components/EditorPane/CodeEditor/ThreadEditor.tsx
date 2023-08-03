import React, { useState } from 'react';

import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import { autocompletion } from "@codemirror/autocomplete";
import { lintGutter } from "@codemirror/lint";
import pythonLinter from '../../../util/python-syntax-lint';
import { indentationMarkers } from '@replit/codemirror-indentation-markers';

import { Autocomplete, TextField, Grid } from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SaveIcon from '@mui/icons-material/Save';
import completions from '../../../util/patch-autocompletions';
import { Thread } from '../types';
import usePatchStore from '../../../store';
import { HorizontalButtons, DeleteButton, IconButton } from '../../PatchButton';


type ThreadEditorProps = {
    thread: Thread,
    first: boolean,
    final: boolean,
}

export const ThreadEditor = ({ thread, first, final }: ThreadEditorProps) => {
    const setProjectChanged = usePatchStore((state) => state.setProjectChanged);
    const addThread = usePatchStore((state) => state.addThread);
    const deleteThread = usePatchStore((state) => state.deleteThread);
    const updateThread = usePatchStore((state) => state.updateThread);
    const saveThread = usePatchStore((state) => state.saveThread);
    const getThread = usePatchStore((state) => state.getThread);
    const patchVM = usePatchStore((state) => state.patchVM);
    const editingTargetId = usePatchStore((state) => state.editingTargetId);

    const [triggerEvent, setTriggerEvent] = useState(thread.triggerEvent);
    const [triggerEventOption, setTriggerEventOption] = useState(thread.triggerEventOption);

    const handleAdd = () => {
        addThread(patchVM.editingTarget);
    }

    const handleDelete = () => {
        deleteThread(thread.id);
    }
    
    const handleSave = () => {
        saveThread(thread.id);
    }

    const handleCodeChange = (newScript: string) => {
        updateThread(thread.id, newScript);
    }

    const handleEventChange = (_: React.ChangeEvent<{}>, newValue: { id: string }) => {
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
    
    const handleEventOptionChange = (_: React.ChangeEvent<{}>, newValue: { id: string }) => {
        thread.updateThreadTriggerEventOption(newValue.id)
        setTriggerEventOption(newValue.id);
        setProjectChanged(true);
    }

    const handleEventOptionBroadcastChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        thread.updateThreadTriggerEventOption(event.target.value);
        setProjectChanged(true);
    }

    const eventMap = patchVM.getEventLabels();
    const eventList = Object.keys(eventMap).map((event) => {return { id: event, label: eventMap[event] }});
    let eventOptionsList;
    if (thread.triggerEvent !== "event_whenbroadcastreceived") {
        eventOptionsList = (patchVM.getEventOptionsMap(triggerEvent) ?? []).map((eventOption: string) => { return { id: eventOption, label: eventOption}});
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
                        onChange={handleEventChange}
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
                        onChange={handleEventOptionChange}
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
                <Grid item sx={{ width: (/* !first XOR final */ !first !== final) ? 134 : ((!first && final) ? 198 : 68), padding: 0 }}>
                    <HorizontalButtons spacing={"2px"} sx={{maxHeight: 40}}>
                        <IconButton color="success" onClick={handleSave} disabled={getThread(thread.id).saved} sx={{ height: 40 }} icon={<SaveIcon />} />
                        {!first && <DeleteButton onClick={handleDelete} sx={{height: 40}} />}
                        {final && <IconButton onClick={handleAdd} icon={<PostAddIcon />} sx={{height: 40}} />}
                    </HorizontalButtons>
                </Grid>
            </Grid>
            <Grid marginTop="4px">
                <CodeMirror
                    value={getThread(thread.id).text}
                    extensions={[python(), autocompletion({override: [completions(patchVM)]}), pythonLinter(console.log, patchVM, thread.id), lintGutter(), indentationMarkers()]}
                    theme="dark"
                    onChange={handleCodeChange}
                    height="calc(100vh - 169px)"
                />
            </Grid>
        </>
    );
}