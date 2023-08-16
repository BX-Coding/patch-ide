import { Target } from "../components/EditorPane/types";
import usePatchStore from "../store";

export const useEditingTarget = (): [Target | null, (target: Target | string) => void] => {
    const patchVM = usePatchStore(state => state.patchVM);
    const editingTargetId = usePatchStore(state => state.editingTargetId);
    const setEditingTargetId = usePatchStore(state => state.setEditingTargetId);
    const loadTargetThreads = usePatchStore(state => state.loadTargetThreads);
    const saveTargetThreads = usePatchStore(state => state.saveTargetThreads);
    const loadTargetCostumes = usePatchStore(state => state.loadTargetCostumes);
    const loadTargetSounds = usePatchStore(state => state.loadTargetSounds);

    const getEditingTarget = (): Target | null => {
        if (!patchVM) {
            return null;
        }
        if (!patchVM.runtime) {
            return null;
        }
        if (editingTargetId == "") {
            return null;
        }
        return patchVM.runtime.getTargetById(editingTargetId);
    }

    const loadTargetAssets = (editingTarget: Target) => {
        loadTargetThreads(editingTarget);
        loadTargetCostumes(editingTarget);
        loadTargetSounds(editingTarget);
    }
    
    const setEditingTarget = (target: Target | string) => {
        if (!patchVM) {
            return;
        }
        const targetId = typeof target == "string" ? target : target.id;
    
        saveTargetThreads(patchVM.editingTarget);
    
        patchVM.setEditingTarget(targetId);
        setEditingTargetId(targetId);
    
        loadTargetAssets(patchVM.editingTarget);
    }

    return [getEditingTarget(), setEditingTarget];
}