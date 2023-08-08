import { Target } from "../components/EditorPane/types";
import usePatchStore from "../store";

const getEditingTarget = (patchVM: any, editingTargetId: string): Target | null => {
    if (!patchVM) {
        return null;
    }
    if (editingTargetId == "") {
        return null;
    }
    return patchVM.runtime.getTargetById(editingTargetId);
}

const setEditingTarget = (patchVM: any, setEditingTargetId: (id: string) => void, loadTargetThreads: (target: Target) => void) => (target: Target | string) => {
    if (!patchVM) {
        return;
    }
    const targetId = typeof target == "string" ? target : target.id;
    patchVM.setEditingTarget(targetId);
    setEditingTargetId(targetId);
    loadTargetThreads(patchVM.editingTarget);
}

export const useEditingTarget = (): [Target | null, (target: Target | string) => void] => {
    const patchVM = usePatchStore(state => state.patchVM);
    const editingTargetId = usePatchStore(state => state.editingTargetId);
    const setEditingTargetId = usePatchStore(state => state.setEditingTargetId);
    const loadTargetThreads = usePatchStore(state => state.loadTargetThreads);
    return [getEditingTarget(patchVM, editingTargetId), setEditingTarget(patchVM, setEditingTargetId, loadTargetThreads)];
}