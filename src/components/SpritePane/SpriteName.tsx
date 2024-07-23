import React, { useEffect, useState } from 'react';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import Grid from '@mui/material/Grid';

import { HorizontalButtons, IconButton } from '../PatchButton';
import usePatchStore from '../../store';
import { useEditingTarget } from '../../hooks/useEditingTarget';
import { Sprite } from 'leopard';

export function SpriteName() {
    const patchVM = usePatchStore((state) => state.patchVM);
    const targetIds = usePatchStore((state) => state.targetIds);
    const setProjectChanged = usePatchStore((state) => state.setProjectChanged);
    const setTargetIds = usePatchStore((state) => state.setTargetIds);

    const [editingTarget, setEditingTarget] = useEditingTarget();
    const [nameSaved, setNameSaved] = useState(true);
    const [name, setName] = useState(editingTarget?.id);

    const handleSave = () => {
        if (!editingTarget) {
            return;
        }
        name && patchVM.renameSprite(editingTarget.id, name);
        setProjectChanged(true);
        setNameSaved(true);
        setTargetIds(Object.keys(patchVM.getAllRenderedTargets()))
        name && setEditingTarget(name);
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
        setNameSaved(false);
    }

    useEffect(() => {
        editingTarget && setName(editingTarget.id);
    }, [editingTarget]);


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
            <IconButton icon={<SaveIcon />} color="success" onClick={handleSave} disabled={nameSaved || !(patchVM.editingTarget instanceof Sprite)} sx={{ height: '40px' }} />
        </HorizontalButtons>
    </Grid>);
}