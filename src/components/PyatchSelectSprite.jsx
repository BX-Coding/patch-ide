import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import Button from '@mui/material/Button';

export function PyatchSelectSprite(props) {
    const { pyatchVM } = useContext(pyatchContext);
    const { target } = props;

    return(
        <Button variant={target.id == pyatchVM.editingTarget.id ? "contained" : "outlined"} onClick={() => pyatchVM.setEditingTarget(target.id)} sx={{m:"1vh"}}>{target?.sprite?.name}</Button>
    );
}