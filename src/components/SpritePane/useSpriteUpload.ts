import { useEditingTarget } from '../../hooks/useEditingTarget';
import { spriteUpload } from '../../lib/file-uploader';
import usePatchStore from '../../store';
import { Sprite, SpriteJson, Target } from '../EditorPane/types';

export const useUploadSprite = () => {
    const patchVM = usePatchStore(state => state.patchVM);
    const setTargetIds = usePatchStore((state) => state.setTargetIds);
    const setEditingTargetAttributes = usePatchStore((state) => state.setEditingTargetAttributes);
    const [editingTarget, setEditingTarget] = useEditingTarget();

    const changeSpriteValues = (eventSource: Target | null = null, setEditingTargetAttributes: (x: number, y: number, size: number, direction: number) => void, editingTargetId: string) => {
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

    const handleNewSprite = async (spriteJson: Sprite | SpriteJson) => {
        await patchVM.addSprite(spriteJson);
        const targets: Target[] = patchVM.getAllRenderedTargets();
        const newTarget = targets[targets.length - 1];
    
        setTargetIds(targets.map(target => target.id));
        setEditingTarget(newTarget.id);
    
        newTarget.on('EVENT_TARGET_VISUAL_CHANGE', (eventSource: Target | null) => changeSpriteValues(eventSource, setEditingTargetAttributes, editingTarget?.id ?? ""));
    }

    const uploadSprite = async (file: File) => {
        const storage = patchVM.runtime.storage;
        const arrayBuffer = await file.arrayBuffer();
        spriteUpload(arrayBuffer, file.type, file.name, storage, newSprite => {
            handleNewSprite(newSprite);
        }, console.log);
    };

    return uploadSprite;
}