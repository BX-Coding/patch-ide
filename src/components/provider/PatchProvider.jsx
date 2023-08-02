import React, { useState, useEffect, useCallback } from "react";
import PatchContext from "./PatchContext.js";
import Renderer from 'scratch-render';
import makeTestStorage from "../../util/make-test-storage.mjs";
import VirtualMachine from 'pyatch-vm';
import AudioEngine from 'scratch-audio';
import sprites from '../../assets/sprites.ts/index.js';
import ScratchSVGRenderer from 'scratch-svg-renderer';
import { handleFileUpload, costumeUpload, soundUpload } from '../../util/file-uploader.js'

import defaulPatchProject from '../../assets/defaultProject.ptch1';

import SplashScreen from "../SplashScreen/component.jsx";

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

  const costumesUpdate = false;
  const setCostumesUpdate = () => {updateCostumes()};
  const [currentCostumes, setCurrentCostumes] = useState([]);
  const [currentCostumeIndex, setCurrentCostumeIndex] = useState(0);

  const [showInternalChooser, setShowInternalChooser] = useState(false);
  const [internalChooserAdd, setInternalChooserAdd] = useState(false);

  const [showInternalSoundChooser, setShowInternalSoundChooser] = useState(false);

  const [vmLoaded, setVmLoaded] = useState(false);
  const [patchReady, setPatchReady] = useState(false);
  const [globalVariables, setGlobalVariables] = useState([]);
  const [projectChanged, setProjectChanged] = useState(false);

  const [eventLabels, setEventLabels] = useState({});
  const [eventOptionsMap, setEventOptionsMap] = useState({});
  const [broadcastMessageIds, setBroadcastMessageIds] = useState({});

  const [questionAsked, setQuestionAsked] = useState(null);
  const [runButtonDisabled, setRunButtonDisabled] = useState(false);

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
    currentCostumes,
    setCurrentCostumes,
    currentCostumeIndex,
    setCurrentCostumeIndex,
    showInternalChooser,
    setShowInternalChooser,
    internalChooserAdd,
    setInternalChooserAdd,
    showInternalSoundChooser,
    setShowInternalSoundChooser,
    patchReady,
    setPatchReady,
    vmLoaded,
    globalVariables,
    setGlobalVariables,
    projectChanged,
    setProjectChanged,
    eventLabels,
    setEventLabels,
    eventOptionsMap,
    setEventOptionsMap,
    broadcastMessageIds,
    setBroadcastMessageIds,
    questionAsked,
    setQuestionAsked,
    runButtonDisabled,
    setRunButtonDisabled
  });

  const updateCostumes = () => {
    if (!pyatchVM) {return;}
    setCurrentCostumes([...pyatchVM.editingTarget.getCostumes()]);
    setCurrentCostumeIndex(pyatchVM.editingTarget.getCostumeIndexByName(pyatchVM.editingTarget.getCurrentCostume().name));
  }

  useEffect(() => {
    updateCostumes();
  }, [costumesUpdate, vmLoaded, patchReady, editingTargetId]);

  // -------- Sprite Values --------


  addToGlobalState({changeSpriteValues});

  // -------- Saving State --------

  useEffect(() => {
    setProjectChanged(true);
  }, [targetIds]);

  //https://dev.to/zachsnoek/creating-custom-react-hooks-useconfirmtabclose-eno
  const confirmationMessage = "You have unsaved changes. Continue?";
  useEffect(() => {
    const handleBeforeUnload = (event) => {
      if (projectChanged) {
        event.returnValue = confirmationMessage;
        return confirmationMessage;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
      window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [projectChanged]);

  useEffect(() => {
    if (pyatchVM && pyatchVM.editingTarget) {
      handleSaveTargetThreads(pyatchVM.editingTarget);
    }
  }, [handleSaveTargetThreads, patchEditorTab]);

  const handleSaveThread = useCallback((thread) => {
    thread.updateThreadScript(threadsText[thread.id]);
    setSavedThreads({...savedThreads, [thread.id]: true});
  }, [savedThreads, threadsText]);

  const handleSaveTargetThreads = useCallback((target) => {
    const editingThreadIds = Object.keys(target.threads);

    editingThreadIds.forEach(threadId => {
      const thread = target.getThread(threadId);
      handleSaveThread(thread);
    });
  }, [handleSaveThread]);

  // -------- Costume Picking --------


  // -------- Sound Picking --------
  

  addToGlobalState({ 
    handleAddCostumesToActiveTarget, 
    handleAddSoundToActiveTarget, 
    handleSaveThread, 
    handleSaveTargetThreads, 
    handleUploadCostume, 
    handleUploadSound, 
    handleNewCostume
  });

  // -------- Default Project intialization --------

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
    function asyncEffect() {
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

      pyatchVM.runtime.on("QUESTION", onQuestionAsked);
    }
    asyncEffect();

  }, []);

  // -------- Global Functions --------

  const onFlagPressed = async () => {
    await saveAllThreads();
    setRuntimeErrorList([]);
    setRunButtonDisabled(true);
    await pyatchVM.greenFlag();
    setRunButtonDisabled(false);
  }



  const onQuestionAsked = (question) => {
    setQuestionAsked(question);
  }

  

  const saveAllThreads = async () => {
    const threadSavePromises = [];
   Object.keys(threadsText).forEach(async threadId => {
      if (!savedThreads[threadId]) {
        threadSavePromises.push(pyatchVM.getThreadById(threadId).updateThreadScript(threadsText[threadId]));
        setSavedThreads({ ...savedThreads, [threadId]: true });
      }
    });
    await Promise.all(threadSavePromises);
  }
  
  const downloadProject = async () => {
    return pyatchVM.downloadProject();
  }

  const loadSerializedProject = async (vmState) => {
    if (pyatchVM) {
      setPatchReady(false);

      const oldTargets = pyatchVM.runtime.targets;
      const oldExecutableTargets = pyatchVM.runtime.executableTargets;
      const oldGlobalVariables = pyatchVM.runtime._globalVariables;

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

      setProjectChanged(false);
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
    }
    setProjectChanged(false);
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
    onAnswer,
  });

  return (
    <>
      <PatchContext.Provider
        value={{ ...globalPatchIDEState }}
      >
        {!(pyatchVM && vmLoaded && patchReady) && <SplashScreen/>}
        <div style={{display: (pyatchVM && vmLoaded && patchReady) ? "block" : "none"}}>{props.children}</div>
      </PatchContext.Provider>
    </>
  );
};

export default PyatchProvider;