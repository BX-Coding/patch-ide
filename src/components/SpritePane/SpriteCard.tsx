import React, { useContext } from 'react';
import { ItemCard } from '../ItemCard';
import getCostumeUrl from '../../util/get-costume-url';
import { Target } from '../EditorPane/types';
import usePatchStore from '../../store';
import { useEditingTarget } from '../../hooks/useEditingTarget';
import { CostumeImage } from '../CostumeImage';

type SpriteCardProps = {
    target: Target,
}

export function SpriteCard({ target }: SpriteCardProps) {
    const [editingTarget, setEditingTarget] = useEditingTarget();

    
    const onClick = () => {
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
        >
            <CostumeImage costume={target?.sprite?.costumes[0]} className="costumeCardImage" />
        </ItemCard>
    );
}