import React from 'react';

import { Grid } from '@mui/material';
import PostAddIcon from '@mui/icons-material/PostAdd';
import SaveIcon from '@mui/icons-material/Save';
import { Target, Thread } from '../../types';
import usePatchStore from '../../../../store';
import { HorizontalButtons, DeleteButton, IconButton } from '../../../PatchButton';
import { useEditingTarget } from '../../../../hooks/useEditingTarget';
import { TriggerEventSelector } from './TriggerEventSelector';


type ThreadEditorProps = {
    thread: Thread,
    first: boolean,
    final: boolean,
}

export const ThreadBar = ({ thread, first, final }: ThreadEditorProps) => {

    return (
        <Grid container direction="row" spacing={"1px"} mb={"4px"}>
            <TriggerEventSelector thread={thread} />
            <Grid item sx={{ width: (/* !first XOR final */ !first !== final) ? 134 : ((!first && final) ? 198 : 68), padding: 0 }}>
                <HorizontalButtons spacing={"2px"} sx={{maxHeight: 40}}>
                    <SaveThreadButton thread={thread}/>
                    {!first && <DeleteThreadButton thread={thread} />}
                    {final && <AddThreadButton />}
                </HorizontalButtons>
            </Grid>
        </Grid>
    );
}

const AddThreadButton = () => {
    const addThread = usePatchStore((state) => state.addThread);
    const [editingTarget] = useEditingTarget() as [Target, (target: Target) => void];

    const handleAdd = () => {
        addThread(editingTarget);
    }
    return <IconButton onClick={handleAdd} icon={<PostAddIcon />} sx={{ height: 40 }} />
}

const DeleteThreadButton = ({ thread }: { thread: Thread }) => {
    const deleteThread = usePatchStore((state) => state.deleteThread);
    
    const handleDelete = () => {
        deleteThread(thread.id);
    }
    return <DeleteButton onClick={handleDelete} sx={{height: 40}} />
}

const SaveThreadButton = ({ thread }: { thread: Thread }) => {
    const saveThread = usePatchStore((state) => state.saveThread);
    const threadSaved = usePatchStore((state) => state.threads[thread.id].saved);

    const handleSave = () => {
        saveThread(thread.id);
    }
    return <IconButton color="success" onClick={handleSave} disabled={threadSaved} sx={{ height: 40 }} icon={<SaveIcon />} />
}