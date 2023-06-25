import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import TextField from '@mui/material/TextField';


export function PyatchSpriteName(props) {
    const { pyatchVM, setChangesSinceLastSave } = useContext(pyatchContext);
    const { target } = props;

    const updateName = (name) => {
        pyatchVM.getTargetById(target.id).sprite.name = name.target.value;
        setChangesSinceLastSave(true);
    }

    return(
        <TextField 
            defaultValue={target?.sprite?.name ?? ""}
            onChange={updateName}
            fullWidth
            sx={{my: "1vh", input: { color: 'white'}, fieldset: { borderColor: "white" }}}
            size="small"
        />
    );
}