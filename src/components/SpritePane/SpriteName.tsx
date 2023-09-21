import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import Grid from '@mui/material/Grid';

import { HorizontalButtons, IconButton } from '../PatchButton';
import usePatchStore from '../../store';
import { useEditingTarget } from '../../hooks/useEditingTarget';

export function SpriteName() {
    const patchVM = usePatchStore((state) => state.patchVM);
    const targetIds = usePatchStore((state) => state.targetIds);
    const setProjectChanged = usePatchStore((state) => state.setProjectChanged);

    const [editingTarget, setEditingTarget] = useEditingTarget();
    const [nameSaved, setNameSaved] = useState(true);
    const [name, setName] = useState(editingTarget?.sprite.name);

    const handleSave = () => {
        if (!editingTarget) {
            return;
        }
        patchVM.renameSprite(editingTarget.id, name);
        setProjectChanged(true);
        setNameSaved(true);
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
        setNameSaved(false);
    }

    useEffect(() => {
        if (!editingTarget) {
            return;
        }
        setName(editingTarget.sprite.name);
    }, [editingTarget]);

    useEffect(() => {
        console.log("user is typing")
    }, [name])

    return (<Grid display="flex">
        <HorizontalButtons sx={{ marginBottom: '12px' }}>
            <TextField
                value={name}
                onChange={onChange}
                fullWidth
                size="small"
                disabled={targetIds[0] == editingTarget?.id}
                sx={{ minWidth: '532px' }}
            />
            <IconButton icon={<SaveIcon />} color="success" onClick={handleSave} disabled={nameSaved || !patchVM.editingTarget.isSprite()} sx={{ height: '40px' }} />
        </HorizontalButtons>
    </Grid>);
}