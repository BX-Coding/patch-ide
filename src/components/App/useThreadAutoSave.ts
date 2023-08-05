import { useEffect } from "react";
import { EditorTab } from "../../store";
import { useEditingTarget } from "../../hooks/useEditingTarget";

const useThreadAutoSave = (pyatchVM: any, saveTargetThreads: (...params: any[]) => void, editorTab: EditorTab) => {
  const [editingTarget] = useEditingTarget();
  useEffect(() => {
      if (editingTarget) {
        saveTargetThreads(editingTarget);
      }
    }, [saveTargetThreads, editorTab]);
}

export default useThreadAutoSave;
