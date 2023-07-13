import React, { useContext, useEffect, useState } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import SaveIcon from '@mui/icons-material/Save';
import Grid from '@mui/material/Grid';


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
        <TextField 
            value={name}
            onChange={onChange}
            fullWidth
            //sx={{my: "1vh", input: { color: 'white'}, fieldset: { borderColor: "white" }}}
            size="small"
            disabled={targetIds[0] == editingTargetId}
        />
        <Button variant="contained" color="success" onClick={handleSave} disabled={nameSaved || !pyatchVM.editingTarget.isSprite()} sx={{m:"1vh"}}><SaveIcon/></Button>
    </Grid>);
}