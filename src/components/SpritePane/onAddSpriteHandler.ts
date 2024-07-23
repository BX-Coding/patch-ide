import { Sprite, Stage } from "leopard";
import { sprites } from "../../assets/sprites";
import { useEditingTarget } from "../../hooks/useEditingTarget";
import usePatchStore from "../../store";
import { SpriteJson } from "../EditorPane/old-types";

export const changeSpriteValues = (eventSource: Sprite | Stage | null = null, setEditingTargetAttributes: (x: number, y: number, size: number, direction: number) => void, editingTargetId: string) => {
    // only update the attributes if the active sprite has changes
    if (eventSource) {
      if (eventSource.id !== editingTargetId) {
        return;
      }
    }

    const [editingTarget] = useEditingTarget();

    if (editingTarget) {
      editingTarget instanceof Sprite ? setEditingTargetAttributes(editingTarget.x, editingTarget.y, editingTarget.size, editingTarget.direction) : setEditingTargetAttributes(0, 0, 0, 0);
    }

  }


export const useAddSprite = () => {
  const patchVM = usePatchStore((state) => state.patchVM);
  const setTargetIds = usePatchStore((state) => state.setTargetIds);
  const setEditingTargetAttributes = usePatchStore((state) => state.setEditingTargetAttributes);
  const saveTargetThreads = usePatchStore((state) => state.saveTargetThreads);
  const [editingTarget, setEditingTarget] = useEditingTarget();


  const addSprite = async (sprite: Sprite | SpriteJson) => {
    await patchVM.addSprite(sprite, sprite instanceof Sprite ? sprite.id : sprite.name);
    const targets = patchVM.getAllRenderedTargets();
    const targetIds = Object.keys(targets);
    const newTarget = targets[targetIds[targetIds.length - 1]];

    setTargetIds(targetIds);
    setEditingTarget(newTarget.id);

    newTarget.on('MOVE', (eventSource: Sprite | null) => changeSpriteValues(eventSource, setEditingTargetAttributes, editingTarget?.id ?? ""));
    return newTarget;
  }

  const handleUploadedSprite = (newTargetId: string) => {
    const newTarget = patchVM.runtime.getTargetById(newTargetId);
    newTarget.deleteCostume(0);
  }

  const onAddSprite = async (sprite?: Sprite | SpriteJson) => {
    if (editingTarget) {
      saveTargetThreads(editingTarget);
    }
    const validatedSprite = sprite ? sprite : sprites[0];
    const newTarget = await addSprite(validatedSprite);
    return newTarget?.id;
  }

  return {onAddSprite, handleUploadedSprite};
}