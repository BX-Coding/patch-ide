import React, { useContext, useEffect, useState } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Grid from '@mui/material/Grid';

import { PatchHorizontalButtons, PatchIconButton } from './PatchTemplates.jsx';

export function PyatchSpriteName(props) {
    const { pyatchVM, targetIds, editingTargetId, setChangesSinceLastSave } = useContext(pyatchContext);
    const editingTarget = pyatchVM.runtime.getTargetById(editingTargetId);
    const [nameSaved, setNameSaved] = useState(true);
    const [name, setName] = useState(editingTarget.sprite.name);

    const handleSave = () => {
        pyatchVM.renameSprite(editingTargetId, name);
        setChangesSinceLastSave(true);
        setNameSaved(true);
    }

    const onChange = (event) => {
        setName(event.target.value);
        setNameSaved(false);
    }

    useEffect(() => {
        setName(editingTarget.sprite.name);
    }, [editingTarget]);

    return(<Grid display="flex">
        <PatchHorizontalButtons sx={{marginBottom: '12px'}}>
            <TextField 
                value={name}
                onChange={onChange}
                fullWidth
                size="small"
                disabled={targetIds[0] == editingTargetId}
                sx={{minWidth: '532px'}}
            />
            <PatchIconButton icon={<SaveIcon />} color="success" onClick={handleSave} disabled={nameSaved || !pyatchVM.editingTarget.isSprite()} sx={{height: '40px'}} />
        </PatchHorizontalButtons>
    </Grid>);
}