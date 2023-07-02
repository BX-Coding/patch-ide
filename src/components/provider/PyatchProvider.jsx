import React, { useState, useEffect, useMemo, createContext } from "react";
import PyatchContext from "./PyatchContext.js";
import { PYATCH_EXECUTION_STATES, PYATCH_LOADING_MESSAGES } from "../../util/ExecutionState.js";
import Renderer from 'scratch-render';
import makeTestStorage from "../../util/make-test-storage.mjs";
import VirtualMachine from 'pyatch-vm';
import AudioEngine from 'scratch-audio';
import backdrops from '../../assets/backdrops.json';
import sprites from '../../assets/sprites.json';
import ScratchSVGRenderer from 'scratch-svg-renderer';
import { handleFileUpload, costumeUpload } from '../../util/file-uploader.js'

import defaulPatchProject from '../../assets/defaultProject.ptch1';

import SplashScreen from "../SplashScreen.jsx";

import { Buffer } from 'buffer-es6'

window.Buffer = Buffer;

let globalPatchIDEState = {};
const addToGlobalState = (map) => {
  globalPatchIDEState = { ...globalPatchIDEState, ...map };
}
export let pyatchVM = null;

const PyatchProvider = props => {
  //  -------- Patch Editor Global State --------
  const [targetIds, setTargetIds] = useState([]);
  const [editingTargetId, setEditingTargetId] = useState(null);
  
  const [editingTargetX, setEditingTargetX] = useState(0);
  const [editingTargetY, setEditingTargetY] = useState(0);
  const [editingTargetSize, setEditingTargetSize] = useState(0);
  const [editingTargetDirection, setEditingTargetDirection] = useState(0);

  const [threadsText, setThreadsText] = useState({});
  const [savedThreads, setSavedThreads] = useState({});

  const [patchEditorTab, setPatchEditorTab] = useState(0);
  const [runtimeErrorList, setRuntimeErrorList] = useState([]);

  const [costumesUpdate, setCostumesUpdate] = useState(false);

  const [showInternalChooser, setShowInternalChooser] = useState(false);
  const [internalChooserAdd, setInternalChooserAdd] = useState(false);
  const [internalChooserUpdate, setInternalChooserUpdate] = useState(false);

  const [vmLoaded, setVmLoaded] = useState(false);
  const [patchReady, setPatchReady] = useState(false);
  const [globalVariables, setGlobalVariables] = useState([]);
  const [changesSinceLastSave, setChangesSinceLastSave] = useState(false);

  const [eventLabels, setEventLabels] = useState({});
  const [eventOptionsMap, setEventOptionsMap] = useState({});

  addToGlobalState({
    targetIds,
    setTargetIds,
    editingTargetId,
    setEditingTargetId,
    editingTargetX,
    setEditingTargetX,
    editingTargetY,
    setEditingTargetY,
    editingTargetSize,
    setEditingTargetSize,
    editingTargetDirection,
    setEditingTargetDirection,
    threadsText,
    setThreadsText,
    savedThreads,
    setSavedThreads,
    patchEditorTab,
    setPatchEditorTab,
    runtimeErrorList,
    setRuntimeErrorList,
    costumesUpdate,
    setCostumesUpdate,
    showInternalChooser,
    setShowInternalChooser,
    internalChooserAdd,
    setInternalChooserAdd,
    internalChooserUpdate,
    setInternalChooserUpdate,
    patchReady,
    setPatchReady,
    globalVariables,
    setGlobalVariables,
    changesSinceLastSave,
    setChangesSinceLastSave,
    eventLabels,
    setEventLabels,
    eventOptionsMap,
    setEventOptionsMap,
  });



  // -------- Error Handling --------

  //returns array with each line of code for given sprite id
  /*
  const getCodeLines = (sprite) => {
    let linesOfCode = [];
    let prev = 0;
    if (!pyatchEditor.editorText[sprite]) {
      return [];
    }
    for (let i = 0; i < pyatchEditor.editorText[sprite].length; i++) {
      if (pyatchEditor.editorText[sprite][i] == '\n') {
        linesOfCode.push(pyatchEditor.editorText[sprite].substring(prev, i));
        prev = i + 1;
      }
    }
    linesOfCode.push(pyatchEditor.editorText[sprite].substring(prev, pyatchEditor.editorText[sprite].length));
    return linesOfCode;
  }


  function generateError(error) {
    let line = error.line;
    let sprite = error.sprite;
    let linesOfCode = pyatchEditor.getCodeLines(sprite);
    let priorText = [];
    let afterText = [];
    for (let i = 3; i > 0; i--) {
      if (line - i - 1 >= 0 && line - i - 1 < linesOfCode.length) priorText.push(line - i + " " + linesOfCode[line - i - 1]);
      if (line - i + 3 < linesOfCode.length) afterText.push(line - i + 4 + " " + linesOfCode[line - i + 3]);
    }


    let currentError = {
      "uid": currentId,
      "line": line,
      "errName": error.name,
      "priorText": priorText,
      "afterText": afterText,
      "sprite": pyatchEditor.getSpriteName(sprite),
      "errCode": line + " " + linesOfCode[line - 1]
    };
    currentId++;
    return currentError;

  }
  */

  // -------- Sprite Values --------

  const changeSpriteValues = (eventSource = null) => {
    if (!pyatchVM) {
      return;
    }

    // only update the attributes if the active sprite has changes
    if (eventSource) {
      if (eventSource.id !== editingTargetId) {
        return;
      }
    }

    const editingTarget = pyatchVM.runtime.getTargetById(editingTargetId);

    if (editingTarget) {
      setEditingTargetX(editingTarget.x);
      setEditingTargetY(editingTarget.y);
      setEditingTargetSize(editingTarget.size);
      setEditingTargetDirection(editingTarget.direction);
    }

  }

  addToGlobalState({changeSpriteValues});

  // -------- Saving State --------

  useEffect(() => {
    setChangesSinceLastSave(true);
  }, [targetIds]);

  //https://dev.to/zachsnoek/creating-custom-react-hooks-useconfirmtabclose-eno
  const confirmationMessage = "You have unsaved changes. Continue?";
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (changesSinceLastSave) {
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [changesSinceLastSave]);

  // -------- Costume Picking --------

  const handleNewCostume = async (costume, fromCostumeLibrary, targetId) => {
    const costumes = Array.isArray(costume) ? costume : [costume];

    var returnval = await Promise.all(costumes.map(c => {
      if (fromCostumeLibrary) {
        //return pyatchVM.addCostumeFromLibrary(c.md5, c);
        return pyatchVM.addCostume(c.md5ext, c, targetId);
      } else {

        return pyatchVM.addCostume(c.md5, c, targetId);
      }
    }));

    setCostumesUpdate(!costumesUpdate);

    return returnval;
  }

  const handleUploadCostume = (targetId) => {
    //https://stackoverflow.com/questions/16215771/how-to-open-select-file-dialog-via-js
    var input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/png, image/jpeg, image/svg+xml, image/bmp, image/gif';

    input.onchange = e => {
      handleFileUpload(e.target, (buffer, fileType, fileName, fileIndex, fileCount) => {
        costumeUpload(buffer, fileType, pyatchVM.runtime.storage, async vmCostumes => {
          vmCostumes.forEach((costume, i) => {
            costume.name = `${fileName}${i ? i + 1 : ''}`;
          });

          if (targetId == undefined || targetId == null) {
            handleNewCostume(vmCostumes, false, editingTargetId);
          } else {
            handleNewCostume(vmCostumes, false, targetId);
          }

          // await handleNewCostume if you want to do anything here
        }, console.log);
      }, console.log);
    }

    input.click();
  };

  const handleAddCostumesToActiveTarget = (costumes, fromCostumeLibrary) => {
    console.warn(costumes);
    handleNewCostume(costumes, fromCostumeLibrary, editingTargetId);
  }

  addToGlobalState({ 
    handleAddCostumesToActiveTarget, 
    handleUploadCostume, 
    handleNewCostume
  });

  // -------- Default Project intialization --------

  const addDefaultBackground = async () => {
    await pyatchVM.addSprite(backdrops[0]);
    pyatchVM.getAllRenderedTargets()[0].isStage = true;
  }

  const addSprite = async (sprite) => {
    await pyatchVM.addSprite(sprite);
    const targets = pyatchVM.getAllRenderedTargets();
    const newTarget = targets[targets.length - 1];

    setTargetIds(() => [...targetIds, newTarget.id]);
    pyatchVM.setEditingTarget(newTarget.id);
    setEditingTargetId(newTarget.id);

    newTarget.on('EVENT_TARGET_VISUAL_CHANGE', changeSpriteValues);
  }

  const initializeDefaultProject = async () => {
    loadSerializedProject(defaulPatchProject);
  }

  const initializePatchProject = async () => {
    if (hasLocalStorageProject()) {
      await loadFromLocalStorage();
    } else {
      await initializeDefaultProject();
    }
  }

  const pyatchStage = {
    canvas: document.createElement('canvas'),
    height: 400,
    width: 600,
  };

  const initializeThreadGlobalState = () => {
    const threadsText = {};
    const threadsSaved = {};
    pyatchVM.getAllRenderedTargets().forEach(target => {
      target.getThreads().forEach(thread => {
        threadsText[thread.id] = thread.script;
        threadsSaved[thread.id] = true;
      });
    });
    setThreadsText(threadsText);
    setSavedThreads(threadsSaved);
  }

  addToGlobalState({ pyatchVM, pyatchStage });

  // -------- Patch VM & Project Setup --------
  useEffect(() => {
    function useAsyncEffect() {
      setPatchReady(false);

      const scratchRenderer = new Renderer(pyatchStage.canvas);

      pyatchVM = new VirtualMachine();
      pyatchVM.attachStorage(makeTestStorage());
      pyatchVM.attachRenderer(scratchRenderer);
      pyatchVM.attachAudioEngine(new AudioEngine());
      pyatchVM.attachV2BitmapAdapter(new ScratchSVGRenderer.BitmapAdapter());
      
      pyatchVM.runtime.draw();
      pyatchVM.start();

      initializePatchProject();

      // -------- Patch Listeners --------
      pyatchVM.on('RUNTIME ERROR', (threadId, message, lineNumber) => {
        setRuntimeErrorList([...runtimeErrorList, { threadId, message, lineNumber }]);
      });

      pyatchVM.on("VM READY", () => {
        setVmLoaded(true);
      });
    }
    useAsyncEffect();

  }, []);

  // -------- Global Functions --------

  const onFlagPressed = () => {
    saveAllThreads();
    setRuntimeErrorList([]);
    pyatchVM.runtime.greenFlag();
  }
  
  const onAddSprite = async (sprite = sprites[0]) => {
    await addSprite(sprite);
    return pyatchVM.editingTarget.id;
  }

  const onDeleteSprite = async (targetId) => {
    await pyatchVM.deleteSprite(targetId);
    setTargetIds(targetIds.filter(id => id !== targetId));
    setEditingTargetId(pyatchVM.editingTarget.id);
  }

  const saveAllThreads = () => {
    Object.keys(threadsText).forEach(threadId => {
      if (!savedThreads[threadId]) {
        pyatchVM.getThreadById(threadId).updateThreadScript(threadsText[threadId]);
        setSavedThreads({ ...savedThreads, [threadId]: true });
      }
    });
  }
  
  const downloadProject = async () => {
    return pyatchVM.downloadProject();
  }

  const loadSerializedProject = async (vmState) => {
    if (pyatchVM) {
      setPatchReady(false);
      /* TODO: clear out old targets first */

      const oldTargets = pyatchVM.runtime.targets;
      const oldExecutableTargets = pyatchVM.runtime.executableTargets;
      const oldGlobalVariables = pyatchVM.runtime._globalVariables;

      // pyatchVM.runtime.targets = [];
      // pyatchVM.runtime.executableTargets = [];
      pyatchVM.runtime._globalVariables = {};

      const result = await pyatchVM.loadProject(vmState);

      if (result == null) {
        console.warn("Something went wrong and the GUI received a null value for the project to load. Aborting.");

        pyatchVM.runtime.targets = oldTargets;
        pyatchVM.runtime.executableTargets = oldExecutableTargets;
        pyatchVM.runtime.pyatchWorker._globalVariables = oldGlobalVariables;

        return;
      }

      setGlobalVariables(result.json.globalVariables);
      setTargetIds(pyatchVM.getAllRenderedTargets().map(target => target.id));
      const editingTargetId = pyatchVM?.editingTarget?.id ?? pyatchVM.runtime.targets[0].id;
      pyatchVM.setEditingTarget(editingTargetId);
      setEditingTargetId(editingTargetId);
      changeSpriteValues(editingTargetId);
      initializeThreadGlobalState();

      setChangesSinceLastSave(false);
      setPatchReady(true);
    }
  }

  const saveToLocalStorage = async () => {
    // https://stackoverflow.com/questions/18650168/convert-blob-to-base64
    let proj = await pyatchVM.zipProject();
    var reader = new FileReader();
    reader.readAsDataURL(proj);
    reader.onloadend = function () {
      var base64data = reader.result;
      if (base64data) {
        localStorage.removeItem("proj");
        localStorage.setItem("proj", base64data);
      } else {
        console.error("The base64data to save is null for some reason. Abort.");
      }
      /* TODO: display a "saved" dialog somewhere */
      console.log("Saved.");
    }
    setChangesSinceLastSave(false);
  }

  // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  const b64dataurltoBlob = (b64Data, contentType = '', sliceSize = 512) => {
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

  const hasLocalStorageProject = () => {
    return !!localStorage.getItem("proj");
  }

  const loadFromLocalStorage = async () => {
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

  addToGlobalState({
    onAddSprite,
    onDeleteSprite,
    saveAllThreads,
    downloadProject,
    loadSerializedProject,
    saveToLocalStorage,
    hasLocalStorageProject,
    loadFromLocalStorage,
    onFlagPressed,
  });

  return (
    <>
      <PyatchContext.Provider
        value={{ ...globalPatchIDEState }}
      >
        {!(pyatchVM && vmLoaded && patchReady) && <SplashScreen/>}
        <div style={{display: (pyatchVM && vmLoaded && patchReady) ? "block" : "none"}}>{props.children}</div>
      </PyatchContext.Provider>
    </>
  );
};

export default PyatchProvider;