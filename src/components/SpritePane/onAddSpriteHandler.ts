import { sprites } from "../../assets/sprites";
import { useEditingTarget } from "../../hooks/useEditingTarget";
import usePatchStore from "../../store";
import { Sprite, SpriteJson, Target } from "../EditorPane/types";

export const changeSpriteValues = (eventSource: Target | null = null, setEditingTargetAttributes: (x: number, y: number, size: number, direction: number) => void, editingTargetId: string) => {
    // only update the attributes if the active sprite has changes
    if (eventSource) {
      if (eventSource.id !== editingTargetId) {
        return;
      }
    }

    const [editingTarget] = useEditingTarget();

    if (editingTarget) {
      setEditingTargetAttributes(editingTarget.x, editingTarget.y, editingTarget.size, editingTarget.direction)
    }

  }


export const useAddSprite = () => {
  const patchVM = usePatchStore((state) => state.patchVM);
  const setTargetIds = usePatchStore((state) => state.setTargetIds);
  const setEditingTargetAttributes = usePatchStore((state) => state.setEditingTargetAttributes);
  const saveTargetThreads = usePatchStore((state) => state.saveTargetThreads);
  const [editingTarget, setEditingTarget] = useEditingTarget();


  const addSprite = async (sprite: Sprite | SpriteJson) => {
    await patchVM.addSprite(sprite);
    const targets: Target[] = patchVM.getAllRenderedTargets();
    const newTarget = targets[targets.length - 1];

    setTargetIds(targets.map(target => target.id));
    setEditingTarget(newTarget.id);

    newTarget.on('EVENT_TARGET_VISUAL_CHANGE', (eventSource: Target | null) => changeSpriteValues(eventSource, setEditingTargetAttributes, editingTarget?.id ?? ""));
  }

  const onAddSprite = async (sprite?: Sprite | SpriteJson) => {
    if (editingTarget) {
      saveTargetThreads(editingTarget);
    }
    const validatedSprite = sprite ? sprite : sprites[0];
    await addSprite(validatedSprite);
    return editingTarget?.id;
  }

  return onAddSprite;
}