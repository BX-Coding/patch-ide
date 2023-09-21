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

    let inputName = ''

    // Upon a name change, re-render the sprite's card in a local variable.
    // useEffect(() => {
    //     if ((target?.sprite?.name).length > 16) {
    //         inputName = (target?.sprite?.name).substring(0, 13) + '...'
    //     }
    //     else {
    //         inputName = target?.sprite?.name
    //     }

    // }, [target?.sprite?.name])

    const onClick = () => {
        setEditingTarget(target.id);
    }

    return (
        <>
            {target?.sprite?.name.length > 13 ?
                <ItemCard
                    title={target?.sprite?.name.substring(0, 10) + '...'}
                    selected={editingTarget?.id === target.id}
                    onClick={onClick}
                    key={target?.sprite?.name}
                    width={120}
                    height={120}
                >
                    <CostumeImage costume={target?.sprite?.costumes[0]} className="costumeCardImage" />
                </ItemCard>
                :
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
            }
        </>


    );
}