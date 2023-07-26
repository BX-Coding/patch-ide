import React, { useContext, useState } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import Button from '@mui/material/Button';
import { ItemCard } from './PatchTemplates.jsx';
import getCostumeUrl from '../util/get-costume-url.js';

export function PyatchSelectSprite(props) {
    const { pyatchVM, editingTargetId, setEditingTargetId, handleSaveTargetThreads } = useContext(pyatchContext);
    const { target } = props;
    
    const onClick = () => {
        handleSaveTargetThreads(pyatchVM.editingTarget);
        setEditingTargetId(target.id);
        pyatchVM.setEditingTarget(target.id);
    }

    return(
        <ItemCard
            imageSrc={getCostumeUrl(target?.getCurrentCostume()?.asset)}
            title={target?.sprite?.name}
            selected={editingTargetId === target.id}
            onClick={onClick}
            key={target?.sprite?.name}
            width={120}
            height={120}
        />
    );
}