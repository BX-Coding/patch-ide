import { sprites } from "../../assets/sprites";
import { useEditingTarget } from "../../hooks/useEditingTarget";
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

    const [editingTarget] = useEditingTarget();

    if (editingTarget) {
      setEditingTargetAttributes(editingTarget.x, editingTarget.y, editingTarget.size, editingTarget.direction)
    }

  }


const addSprite = async (sprite: Sprite | SpriteJson) => {
    const patchVM = usePatchStore((state) => state.patchVM);
    const setTargetIds = usePatchStore((state) => state.setTargetIds);
    const [editingTarget, setEditingTarget] = useEditingTarget();

    await patchVM.addSprite(sprite);
    const targets: Target[] = patchVM.getAllRenderedTargets();
    const newTarget = targets[targets.length - 1];

    setTargetIds(targets.map(target => target.id));
    setEditingTarget(newTarget.id);

    newTarget.on('EVENT_TARGET_VISUAL_CHANGE', changeSpriteValues);
}

export const onAddSprite = async (sprite?: Sprite | SpriteJson) => {
    const saveTargetThreads = usePatchStore((state) => state.saveTargetThreads);
    const [editingTarget] = useEditingTarget();

    if (editingTarget) {
      saveTargetThreads(editingTarget);
    }
    const validatedSprite = sprite ? sprite : sprites[0];
    await addSprite(validatedSprite);
    return editingTarget?.id;
}