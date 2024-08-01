import React, { useContext, useEffect, useState } from 'react';
import { ItemCard } from '../ItemCard';
import getCostumeUrl from '../../util/get-costume-url';
import usePatchStore from '../../store';
import { useEditingTarget } from '../../hooks/useEditingTarget';
import { CostumeImage } from '../CostumeImage';
import { Sprite, Stage } from '../../../vm/src';

type SpriteCardProps = {
    target: Sprite | Stage,
}

export function SpriteCard({ target }: SpriteCardProps) {
    const [editingTarget, setEditingTarget] = useEditingTarget();

    const onClick = () => {
        console.log(target.id);
        setEditingTarget(target.id);
    }

    let titleName = target?.id

    if (target && (target.id.length > 13)) {
        titleName = titleName.substring(0, 10) + '...'
    }

    return (
        <>
            <ItemCard
                title={titleName}
                selected={editingTarget?.id === target.id}
                onClick={onClick}
                key={target?.id}
                width={120}
                height={120}
            >
                <CostumeImage costume={target?.getCostumes()[0]} className="costumeCardImage" />
            </ItemCard>

        </>


    );
}