import { sprites } from "../../assets/sprites";
import usePatchStore from "../../store";
import { Sprite, SpriteJson, Target } from "../EditorPane/types";

export const changeSpriteValues = (eventSource: Target | null = null) => {
    const patchVM = usePatchStore((state) => state.patchVM);
    const setEditingTargetAttributes = usePatchStore((state) => state.setEditingTargetAttributes);
    
    if (!patchVM) {
      return;
    }

    // only update the attributes if the active sprite has changes
    if (eventSource) {
      if (eventSource.id !== patchVM.editingTarget?.id) {
        return;
      }
    }

    const editingTarget = patchVM.editingTarget;

    if (editingTarget) {
      setEditingTargetAttributes(editingTarget.x, editingTarget.y, editingTarget.size, editingTarget.direction)
    }

  }


const addSprite = async (sprite: Sprite | SpriteJson) => {
    const patchVM = usePatchStore((state) => state.patchVM);
    const setTargetIds = usePatchStore((state) => state.setTargetIds);
    const setEditingTargetId = usePatchStore((state) => state.setEditingTargetId);

    await patchVM.addSprite(sprite);
    const targets: Target[] = patchVM.getAllRenderedTargets();
    const newTarget = targets[targets.length - 1];

    setTargetIds(targets.map(target => target.id));
    patchVM.setEditingTarget(newTarget.id);
    setEditingTargetId(newTarget.id);

    newTarget.on('EVENT_TARGET_VISUAL_CHANGE', changeSpriteValues);
}

export const onAddSprite = async (sprite?: Sprite | SpriteJson) => {
    const patchVM = usePatchStore((state) => state.patchVM);
    const saveTargetThreads = usePatchStore((state) => state.saveTargetThreads);

    if (patchVM && patchVM.editingTarget) {
      saveTargetThreads(patchVM.editingTarget);
    }
    const validatedSprite = sprite ? sprite : sprites[0];
    await addSprite(validatedSprite);
    return patchVM.editingTarget.id;
}