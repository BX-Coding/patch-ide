import { Costume, Sprite, Stage } from "leopard";
import { useEditingTarget } from "../../hooks/useEditingTarget";
import usePatchStore from "../../store";
import { CostumeJson, loadFromAssetJson, SpriteJson } from "../EditorPane/types";
import patchAssetStorage from "../../engine/storage/storage";

export const changeSpriteValues = (eventSource: Sprite | Stage | null = null, setEditingTargetAttributes: (x: number, y: number, size: number, direction: number) => void, editingTargetId: string) => {
    // only update the attributes if the active sprite has changes
    if (eventSource) {
        if (eventSource.id !== editingTargetId) {
            return;
        }
    }

    eventSource instanceof Sprite ? setEditingTargetAttributes(eventSource.x, eventSource.y, eventSource.size, eventSource.direction) : setEditingTargetAttributes(0, 0, 0, 0);
}


export const useAddSprite = () => {
    const patchVM = usePatchStore((state) => state.patchVM);
    const setTargetIds = usePatchStore((state) => state.setTargetIds);
    const setEditingTargetAttributes = usePatchStore((state) => state.setEditingTargetAttributes);
    const saveTargetThreads = usePatchStore((state) => state.saveTargetThreads);
    const [editingTarget, setEditingTarget] = useEditingTarget();


    const addSprite = async (sprite: Sprite) => {
        patchVM.addSprite(sprite);
        const targets = patchVM.getAllRenderedTargets();
        const targetIds = Object.keys(targets);
        const newTarget = targets[targetIds[targetIds.length - 1]];

        setTargetIds(targetIds);
        setEditingTarget(newTarget.id);

        console.log(targetIds);
        newTarget.on('MOVE', (eventSource: Sprite | null) => changeSpriteValues(eventSource, setEditingTargetAttributes, editingTarget?.id ?? ""));
        return newTarget;
    }

    const handleUploadedSprite = (newTargetId: string) => {
        const newTarget = patchVM.runtime.getTargetById(newTargetId);
        newTarget.deleteCostume(0);
    }

    const onAddSprite = async (sprite: Sprite | SpriteJson) => {
        if (editingTarget) {
            saveTargetThreads(editingTarget);
        }

        let newSprite: Sprite;

        if (sprite instanceof Sprite) {
            newSprite = sprite;
        } else {
            newSprite = loadFromAssetJson(sprite) as Sprite;
        }

        const newTarget = await addSprite(newSprite);
        return newTarget?.id;
    }

    return { onAddSprite, handleUploadedSprite };
}