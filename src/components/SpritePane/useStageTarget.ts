import usePatchStore from "../../store";
import { Target } from "../EditorPane/types";

export const useStageTarget = (): Target | null => {
    const patchVM = usePatchStore(state => state.patchVM);
    if (!patchVM) {
        return null;
    }
    if (!patchVM.runtime) {
        return null;
    }
    return patchVM.runtime.getTargetForStage();
}