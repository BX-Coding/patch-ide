import { useEffect } from "react";
import { EditorTab } from "../../store";

const useThreadAutoSave = (pyatchVM: any, saveTargetThreads: (...params: any[]) => void, editorTab: EditorTab) => {
    useEffect(() => {
        if (pyatchVM && pyatchVM.editingTarget) {
          saveTargetThreads(pyatchVM.editingTarget);
        }
      }, [saveTargetThreads, editorTab]);
}

export default useThreadAutoSave;
