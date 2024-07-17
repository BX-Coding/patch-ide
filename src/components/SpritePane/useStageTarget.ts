import { Stage } from "leopard";
import usePatchStore from "../../store";

export const useStageTarget = (): Stage | null => {
    const patchVM = usePatchStore(state => state.patchVM);
    if (!patchVM) {
        return null;
    }
    if (!patchVM.runtime) {
        return null;
    }
    return patchVM.runtime.getTargetForStage();
}