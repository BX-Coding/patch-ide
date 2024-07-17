import { Dictionary } from '../../engine/interfaces';
import { useEditingTarget } from '../../hooks/useEditingTarget';
import { Sprite, Stage } from 'leopard';
import { spriteUpload } from '../../lib/file-uploader';
import usePatchStore from '../../store';
import { SpriteJson } from '../EditorPane/old-types';

export const useUploadSprite = () => {
    const patchVM = usePatchStore(state => state.patchVM);
    const setTargetIds = usePatchStore((state) => state.setTargetIds);
    const setEditingTargetAttributes = usePatchStore((state) => state.setEditingTargetAttributes);
    const [editingTarget, setEditingTarget] = useEditingTarget();

    const changeSpriteValues = (eventSource: Sprite | Stage | null = null, setEditingTargetAttributes: (x: number, y: number, size: number, direction: number) => void, editingTargetId: string) => {
        // only update the attributes if the active sprite has changes
        if (eventSource) {
          if (eventSource.id !== editingTargetId) {
            return;
          }
        }
      
        const [editingTarget] = useEditingTarget();
      
        if (editingTarget) {
          if (editingTarget instanceof Sprite) {
            const editingTargetSprite = editingTarget as Sprite;
            setEditingTargetAttributes(editingTargetSprite.x, editingTargetSprite.y, editingTargetSprite.size, editingTargetSprite.direction)
          } else {
            setEditingTargetAttributes(0, 0, 0, 0);
          }
        }
      }

    const handleNewSprite = async (sprite: Sprite, name: string) => {
        await patchVM.addSprite(sprite, name);

        const targets = patchVM.getAllRenderedTargets();
        const newTargetIds = Object.keys(targets);

        const newTarget = targets[newTargetIds.length - 1];
    
        setTargetIds(newTargetIds);
        setEditingTarget(newTargetIds[newTargetIds.length - 1]);
    
        // TODO: make this work again
        //newTarget.on('EVENT_TARGET_VISUAL_CHANGE', (eventSource: Sprite | null) => changeSpriteValues(eventSource, setEditingTargetAttributes, editingTarget?.id ?? ""));
    }

    const uploadSprite = async (file: File) => {
        const storage = patchVM.runtime.storage;
        const arrayBuffer = await file.arrayBuffer();
        spriteUpload(arrayBuffer, file.type, file.name, storage, newSprite => {
          const json = newSprite as SpriteJson;
          if (json.isStage) {
            console.error("Trying to add stage using uploadSprite, but this isn't a thing.");
            const newSpriteSprite = new Sprite({x: 0, y: 0, direction: 0, costumeNumber: 0, size: 1, visible: true});
            handleNewSprite(newSpriteSprite, json.name);
          } else {
            const newSpriteSprite = new Sprite({x: 0, y: 0, direction: 0, costumeNumber: 0, size: 1, visible: true});
            handleNewSprite(newSpriteSprite, json.name);
          }
        }, console.log);
    };

    return uploadSprite;
}