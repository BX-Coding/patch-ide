import React, { useContext } from 'react';
import patchContext from './provider/PatchContext.js';
import { ItemCard } from './PatchButtons.jsx';
import getCostumeUrl from '../util/get-costume-url.js';

export function SpriteCard(props) {
    const { pyatchVM, editingTargetId, setEditingTargetId, handleSaveTargetThreads } = useContext(patchContext);
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