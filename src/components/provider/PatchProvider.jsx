import React, { useState, useEffect, useCallback } from "react";
import PatchContext from "./PatchContext";
import Renderer from 'scratch-render';
import makeTestStorage from "../../util/make-test-storage.ts/index.js";
import VirtualMachine from 'pyatch-vm';
import AudioEngine from 'scratch-audio';
import sprites from '../../assets/sprites.ts/index';
import ScratchSVGRenderer from 'scratch-svg-renderer';
import { handleFileUpload, costumeUpload, soundUpload } from '../../util/file-uploader'

import defaulPatchProject from '../../assets/defaultProject.ptch1';

import SplashScreen from "../SplashScreen/component";

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