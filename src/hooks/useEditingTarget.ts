import { Target } from "../components/EditorPane/types";
import usePatchStore from "../store";

const getEditingTarget = (): Target | null => {
    const patchVM = usePatchStore(state => state.patchVM);
    const editingTargetId = usePatchStore(state => state.editingTargetId);
    if (!patchVM) {
        return null;
    }
    if (editingTargetId == "") {
        return null;
    }
    return patchVM.runtime.getTargetById(editingTargetId);
}

const setEditingTarget = (target: Target | string) => {
    const patchVM = usePatchStore(state => state.patchVM);
    const setEditingTargetId = usePatchStore(state => state.setEditingTargetId);
    if (!patchVM) {
        return;
    }
    const targetId = typeof target == "string" ? target : target.id;
    patchVM.setEditingTarget(targetId);
    setEditingTargetId(targetId);
}

export const useEditingTarget = (): [Target | null, (target: Target | string) => void] => {
    return [getEditingTarget(), setEditingTarget];
}