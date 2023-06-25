import React, { useContext, useState } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import Button from '@mui/material/Button';

export function PyatchSelectSprite(props) {
    const { pyatchVM } = useContext(pyatchContext);
    const { target } = props;
    const [isEditing, setIsEditing] = useState(target.id == pyatchVM.editingTarget.id);
    
    const onClick = () => {
        pyatchVM.setEditingTarget(target.id);
        setIsEditing(target.id == pyatchVM.editingTarget.id);
    }

    return(
        <Button variant={isEditing ? "contained" : "outlined"} onClick={onClick} sx={{m:"1vh"}}>{target?.sprite?.name}</Button>
    );
}