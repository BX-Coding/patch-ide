import usePatchStore from "../store";
import { VmState, Target, Thread } from "../components/EditorPane/types";
import { changeSpriteValues } from "../components/SpritePane/onAddSpriteHandler";

export const downloadProject = async (patchVM: any) => {
    return patchVM.downloadProject();
  }

const initializeThreadGlobalState = (patchVM: any, loadTargetThreads: (target: Target) => void, saveAllThreads: () => void) => {
    patchVM.getAllRenderedTargets().forEach((target: Target) => {
        loadTargetThreads(target);
    });
    saveAllThreads();
}

export const loadSerializedProject = async (vmState: Blob | string | ArrayBuffer) => {
    const patchVM = usePatchStore((state) => state.patchVM);
    const setPatchReady = usePatchStore((state) => state.setPatchReady);
    const setGlobalVariables = usePatchStore((state) => state.setGlobalVariables);
    const setTargetIds = usePatchStore((state) => state.setTargetIds);
    const setEditingTargetId = usePatchStore((state) => state.setEditingTargetId);
    const setProjectChanged = usePatchStore((state) => state.setProjectChanged);

    if (patchVM) {
      setPatchReady(false);

      const oldTargets = patchVM.runtime.targets;
      const oldExecutableTargets = patchVM.runtime.executableTargets;
      const oldGlobalVariables = patchVM.runtime._globalVariables;

      patchVM.runtime._globalVariables = {};

      const result: { json: VmState } = await patchVM.loadProject(vmState);

      if (result == null) {
        console.warn("Something went wrong and the GUI received a null value for the project to load. Aborting.");

        patchVM.runtime.targets = oldTargets;
        patchVM.runtime.executableTargets = oldExecutableTargets;
        patchVM.runtime.pyatchWorker._globalVariables = oldGlobalVariables;

        return;
      }

      setGlobalVariables(result.json.globalVariables);
      setTargetIds(patchVM.getAllRenderedTargets().map((target: Target) => target.id));
      const editingTargetId = patchVM?.editingTarget?.id ?? patchVM.runtime.targets[0].id;
      patchVM.setEditingTarget(editingTargetId);
      setEditingTargetId(editingTargetId);
      changeSpriteValues(editingTargetId);
      initializeThreadGlobalState();

      setProjectChanged(false);
      setPatchReady(true);
    }
  }

  export const saveToLocalStorage = async () => {
    const patchVM = usePatchStore((state) => state.patchVM);
    const setProjectChanged = usePatchStore((state) => state.setProjectChanged);

    // https://stackoverflow.com/questions/18650168/convert-blob-to-base64
    let proj = await patchVM.zipProject();
    var reader = new FileReader();
    reader.readAsDataURL(proj);
    reader.onloadend = function () {
      var base64data = reader.result;
      if (base64data) {
        localStorage.removeItem("proj");
        localStorage.setItem("proj", base64data as string);
      } else {
        console.error("The base64data to save is null for some reason. Abort.");
      }
    }
    setProjectChanged(false);
  }

  // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  export const b64dataurltoBlob = (b64Data: string, contentType = '', sliceSize = 512) => {
    const patchVM = usePatchStore((state) => state.patchVM);
    // the split removes the encoding info from the data url and just returns the raw data
    const byteCharacters = atob(b64Data.split(',')[1]);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      const slice = byteCharacters.slice(offset, offset + sliceSize);

      const byteNumbers = new Array(slice.length);
      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: contentType });
    return blob;
  }

  export const hasLocalStorageProject = () => {
    return !!localStorage.getItem("proj");
  }

  export const loadFromLocalStorage = async () => {
    let text = localStorage.getItem("proj");
    if (text) {
      console.log("Loading from localStorage...");
      let proj = b64dataurltoBlob(text, 'application/zip');
      await loadSerializedProject(proj);
      console.log("Loaded from localStorage...");
      return true;
    } else {
      console.warn("No project detected in localStorage.");
      return false;
    }
  }