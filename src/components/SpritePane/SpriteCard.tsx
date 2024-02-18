import React, { useContext, useEffect, useState } from 'react';
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

    let titleName = target?.sprite?.name

    if (target?.sprite?.name.length > 13) {
        titleName = titleName.substring(0, 10) + '...'
    }

    return (
        <>
            <ItemCard
                title={titleName}
                selected={editingTarget?.id === target.id}
                onClick={onClick}
                key={target?.sprite?.name}
                width={120}
                height={120}
            >
                <CostumeImage costume={target?.sprite?.costumes[0]} className="costumeCardImage" />
            </ItemCard>

        </>


    );
}