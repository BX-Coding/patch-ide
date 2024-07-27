import { Dictionary } from '../../engine/interfaces';
import { useEditingTarget } from '../../hooks/useEditingTarget';
import { Sprite, Stage } from 'leopard';
//import { spriteUpload } from '../../lib/file-uploader';
import usePatchStore from '../../store';
import { costumeUpload } from '../../lib/file-uploader';

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

    const handleNewSprite = (sprite: Sprite) => {
        patchVM.addSprite(sprite);

        const targets = patchVM.getAllRenderedTargets();
        const newTargetIds = Object.keys(targets);

        const newTarget = targets[newTargetIds.length - 1];
    
        setTargetIds(newTargetIds);
        setEditingTarget(newTargetIds[newTargetIds.length - 1]);
    
        newTarget.on('MOVE', (eventSource: Sprite | null) => changeSpriteValues(eventSource, setEditingTargetAttributes, editingTarget?.id ?? ""));
    }

    const uploadSprite = async (file: File) => {
        const newSprite = new Sprite({
            x: 0,
            y: 0,
            direction: 0,
            costumeNumber: 1,
            size: 1,
            visible: true,
            id: ""
        })

        const arrayBuffer = await file.arrayBuffer();
        costumeUpload(arrayBuffer, file.type, file.name, (vmCostumes => {
            vmCostumes.forEach(costume => {
                newSprite.addCostume(costume);
            })
        }), console.error);

        handleNewSprite(newSprite);

    };

    return uploadSprite;
}