import React from 'react';
import { DeleteButton } from '../PatchButton';
import usePatchStore from '../../store';

export function DeleteSpriteButton() {
    const patchVM = usePatchStore((state) => state.patchVM);
    const targetIds = usePatchStore((state) => state.targetIds);
    const setTargetIds = usePatchStore((state) => state.setTargetIds);
    const editingTargetId = usePatchStore((state) => state.editingTargetId);
    const setEditingTargetId = usePatchStore((state) => state.setEditingTargetId);
    const saveTargetThreads = usePatchStore((state) => state.saveTargetThreads);

    const onDeleteSprite = async (targetId: string) => {
        if (patchVM && patchVM.editingTarget) {
          saveTargetThreads(patchVM.editingTarget);
        }
        patchVM.runtime.emit("targetWasRemoved", patchVM.runtime.getTargetById(targetId));
        await patchVM.deleteSprite(targetId);
        const deletedIndex = targetIds.indexOf(targetId);
        setTargetIds(targetIds.filter(id => id !== targetId));
        const newIndex = deletedIndex > 1 ? deletedIndex - 1 : 0;
        patchVM.setEditingTarget(targetIds[newIndex]);
        setEditingTargetId(patchVM.editingTarget.id);
      }

    return (
        <DeleteButton red={true} disabled={targetIds[0] == editingTargetId} onClick={() => { onDeleteSprite(editingTargetId); }} />
    );
}