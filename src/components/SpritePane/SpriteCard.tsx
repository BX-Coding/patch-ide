import React, { useContext } from 'react';
import { ItemCard } from '../ItemCard';
import getCostumeUrl from '../../util/get-costume-url';
import { Target } from '../EditorPane/types';
import usePatchStore from '../../store';
import { useEditingTarget } from '../../hooks/useEditingTarget';

type SpriteCardProps = {
    target: Target,
}

export function SpriteCard({ target }: SpriteCardProps) {
    const patchVM = usePatchStore((state) => state.patchVM);
    const saveTargetThreads = usePatchStore((state) => state.saveTargetThreads);
    const [editingTarget, setEditingTarget] = useEditingTarget();

    
    const onClick = () => {
        saveTargetThreads(patchVM.editingTarget);
        setEditingTarget(target.id);
    }

    return(
        <ItemCard
            title={target?.sprite?.name}
            selected={editingTarget?.id === target.id}
            onClick={onClick}
            key={target?.sprite?.name}
            width={120}
            height={120}
        >{getCostumeUrl(target?.getCurrentCostume()?.asset)}</ItemCard>
    );
}