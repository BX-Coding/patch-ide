import React from 'react';
import { DeleteButton } from '../PatchButton';
import usePatchStore from '../../store';
import { useEditingTarget } from '../../hooks/useEditingTarget';

export function DeleteSpriteButton() {
    const patchVM = usePatchStore((state) => state.patchVM);
    const targetIds = usePatchStore((state) => state.targetIds);
    const setTargetIds = usePatchStore((state) => state.setTargetIds);
    const saveTargetThreads = usePatchStore((state) => state.saveTargetThreads);

    const [editingTarget, setEditingTarget] = useEditingTarget();

    const onDeleteSprite = async () => {
        if (!editingTarget) {
          return;
        }
        saveTargetThreads(editingTarget);
        patchVM.runtime.emit("targetWasRemoved", editingTarget);
        await patchVM.deleteSprite(editingTarget.id);
        const deletedIndex = targetIds.indexOf(editingTarget.id);
        setTargetIds(targetIds.filter(id => id !== editingTarget.id));
        const newIndex = deletedIndex > 1 ? deletedIndex - 1 : 0;
        setEditingTarget(targetIds[newIndex]);
      }

    return (
        <DeleteButton red={true} disabled={targetIds[0] == editingTarget?.id} onClick={onDeleteSprite} />
    );
}