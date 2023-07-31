import React, { useContext, useEffect, useState } from 'react';
import patchContext from '../provider/PatchContext.js';
import TextField from '@mui/material/TextField';
import SaveIcon from '@mui/icons-material/Save';
import Grid from '@mui/material/Grid';

import { HorizontalButtons, IconButton } from '../PatchButton/component.jsx';
import usePatchStore from '../../store';

export function SpriteName() {
    const patchVM = usePatchStore((state) => state.patchVM);
    const targetIds = usePatchStore((state) => state.targetIds);
    const editingTargetId = usePatchStore((state) => state.editingTargetId);
    const setProjectChanged = usePatchStore((state) => state.setProjectChanged);

    const editingTarget = patchVM.editingTarget;
    const [nameSaved, setNameSaved] = useState(true);
    const [name, setName] = useState(editingTarget.sprite.name);

    const handleSave = () => {
        patchVM.renameSprite(editingTargetId, name);
        setProjectChanged(true);
        setNameSaved(true);
    }

    const onChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setName(event.target.value);
        setNameSaved(false);
    }

    useEffect(() => {
        setName(editingTarget.sprite.name);
    }, [editingTarget]);

    return(<Grid display="flex">
        <HorizontalButtons sx={{marginBottom: '12px'}}>
            <TextField 
                value={name}
                onChange={onChange}
                fullWidth
                size="small"
                disabled={targetIds[0] == editingTargetId}
                sx={{minWidth: '532px'}}
            />
            <IconButton icon={<SaveIcon />} color="success" onClick={handleSave} disabled={nameSaved || !patchVM.editingTarget.isSprite()} sx={{height: '40px'}} />
        </HorizontalButtons>
    </Grid>);
}