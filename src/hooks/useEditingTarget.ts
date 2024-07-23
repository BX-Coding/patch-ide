//import { Target } from "../components/EditorPane/types";
import { Sprite, Stage } from "leopard";
import usePatchStore from "../store";

export const useEditingTarget = (): [Sprite | Stage | null, (target: Sprite | Stage | string) => void] => {
    const patchVM = usePatchStore(state => state.patchVM);
    const editingTargetId = usePatchStore(state => state.editingTargetId);
    const setEditingTargetId = usePatchStore(state => state.setEditingTargetId);
    const loadTargetThreads = usePatchStore(state => state.loadTargetThreads);
    const saveTargetThreads = usePatchStore(state => state.saveTargetThreads);
    const loadTargetCostumes = usePatchStore(state => state.loadTargetCostumes);
    const loadTargetSounds = usePatchStore(state => state.loadTargetSounds);

    const getEditingTarget = (): Sprite | Stage | null => {
        if (!patchVM) {
            return null;
        }
        if (!patchVM.runtime) {
            return null;
        }
        if (editingTargetId == "") {
            return null;
        }
        return patchVM.getTargetById(editingTargetId);
    }

    const loadTargetAssets = (editingTarget: Sprite | Stage) => {
        loadTargetThreads(editingTarget);
        loadTargetCostumes(editingTarget);
        loadTargetSounds(editingTarget);
    }
    
    const setEditingTarget = (target: Sprite | Stage | string) => {
        if (!patchVM) {
            return;
        }
        const targetId = (typeof target == "string") ? target : target.id;
    
        patchVM.editingTarget && saveTargetThreads(patchVM.editingTarget);
    
        patchVM.setEditingTarget(targetId);
        setEditingTargetId(targetId);
    
        if (patchVM.editingTarget) {
            loadTargetAssets(patchVM.editingTarget!);
        }
    }

    return [getEditingTarget(), setEditingTarget];
}