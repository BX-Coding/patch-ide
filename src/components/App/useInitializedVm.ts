import { useEffect, useState } from "react";
// @ts-ignore
import VirtualMachine from "../../engine/virtual-machine";
// @ts-ignore
import Renderer from "scratch-render";
// @ts-ignore
import AudioEngine from "scratch-audio";
// @ts-ignore
import usePatchStore from "../../store";
//import patchFirebaseStorage from "../../lib/firebase-storage";
import { storage } from "../../lib/firebase";
import { VmError, VmErrorType } from "../EditorPane/types";
import { Sprite } from "../../../vm/src";
import { changeSpriteValues } from "../SpritePane/onAddSpriteHandler";
import { useEditingTarget } from "../../hooks/useEditingTarget";
// import { LanguageServerState } from "../../store/LanguageServerEditorState";

const useInitializedVm = (onVmInitialized: () => void) => {
  const setPatchReady = usePatchStore((state) => state.setPatchReady);
  const patchStage = usePatchStore((state) => state.patchStage);
  const patchVM = usePatchStore((state) => state.patchVM);
  const setPatchVM = usePatchStore((state) => state.setPatchVM);
  const setQuestionAsked = usePatchStore((state) => state.setQuestionAsked);
  const setVmLoaded = usePatchStore((state) => state.setVmLoaded);
  const addDiagnostic = usePatchStore((state) => state.addDiagnostic);
  const sendLspState = usePatchStore((state) => state.sendLspState);
  const setEditingTargetAttributes = usePatchStore((state) => state.setEditingTargetAttributes);
  const [editingTarget, setEditingTarget] = useEditingTarget();

  const handleRuntimeError = ({
    threadId,
    message,
    lineNumber,
    type,
  }: VmError) => {
    addDiagnostic({
      threadId,
      message,
      lineNumber,
      type,
      fresh: true,
    });
  };

  useEffect(() => {
    const asyncEffect = async () => {
      setPatchReady(false);

      const patchVM = new VirtualMachine();
      //patchFirebaseStorage.addFirebaseStorageStores(storage);
      //patchVM.attachStorage(patchFirebaseStorage);
      patchVM.attachRenderTarget(`#${patchStage.canvas.id}`);

      patchVM.on("VM READY", () => {
        setVmLoaded(true);

        const targets = patchVM.getAllRenderedTargets();
        const targetIds = Object.keys(targets);

        console.log(targetIds);

        targetIds.forEach(targetId => targets[targetId].on('MOVE', (eventSource: Sprite | null) => changeSpriteValues(null, setEditingTargetAttributes, editingTarget?.id ?? "")));

        setPatchReady(true);
      });

      patchVM.runtime.on("PROJECT_CHANGED", () =>
        sendLspState()
      );

      patchVM.runtime.on("QUESTION", onQuestionAsked);
      patchVM.on("RUNTIME ERROR", handleRuntimeError);

      setPatchVM(patchVM);
    };
    asyncEffect();
  }, []);

  useEffect(() => {
    if (!patchVM) {
      return;
    }
    onVmInitialized();
  }, [patchVM]);
  
  const onQuestionAsked = (question: string | null) => {
    setQuestionAsked(question);
  };
};

export default useInitializedVm;
