import React, { useContext, useState } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import Button from '@mui/material/Button';

export function PyatchSelectSprite(props) {
    const { pyatchVM, editingTargetId, setEditingTargetId } = useContext(pyatchContext);
    const { target } = props;
    
    const onClick = () => {
        setEditingTargetId(target.id);
        pyatchVM.setEditingTarget(target.id);
    }

    return(
        <Button variant={editingTargetId === target.id ? "contained" : "outlined"} onClick={onClick} sx={{m:"1vh"}}>{target?.sprite?.name}</Button>
    );
}