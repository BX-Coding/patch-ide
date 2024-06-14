import { useEffect, useState } from "react";
// @ts-ignore
import VirtualMachine from "pyatch-vm";
// @ts-ignore
import Renderer from "scratch-render";
// @ts-ignore
import AudioEngine from "scratch-audio";
// @ts-ignore
import ScratchSVGRenderer from "scratch-svg-renderer";
import usePatchStore from "../../store";
import patchStorage from "../../lib/storage";
import { storage } from "../../lib/firebase";
import { VmError, VmErrorType } from "../EditorPane/types";
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
  const transRef = usePatchStore((state)=>state.transportRef)

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
      patchStorage.addFirebaseStorageStores(storage);
      patchVM.attachStorage(patchStorage);
      const scratchRenderer = new Renderer(patchStage.canvas);
      patchVM.attachRenderer(scratchRenderer);
      patchVM.attachAudioEngine(new AudioEngine());
      patchVM.attachV2BitmapAdapter(new ScratchSVGRenderer.BitmapAdapter());

      patchVM.runtime.draw();
      patchVM.start();

      patchVM.on("VM READY", () => {
        setVmLoaded(true);
      });

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
