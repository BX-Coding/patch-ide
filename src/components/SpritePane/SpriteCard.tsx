import React, { useContext } from 'react';
import { ItemCard } from '../ItemCard';
import getCostumeUrl from '../../util/get-costume-url.js';
import { Target } from '../EditorPane/types.js';
import usePatchStore from '../../store';

type SpriteCardProps = {
    target: Target,
}

export function SpriteCard({ target }: SpriteCardProps) {
    const patchVM = usePatchStore((state) => state.patchVM);
    const editingTargetId = usePatchStore((state) => state.editingTargetId);
    const setEditingTargetId = usePatchStore((state) => state.setEditingTargetId);
    const saveTargetThreads = usePatchStore((state) => state.saveTargetThreads);

    
    const onClick = () => {
        saveTargetThreads(patchVM.editingTarget);
        setEditingTargetId(target.id);
        patchVM.setEditingTarget(target.id);
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