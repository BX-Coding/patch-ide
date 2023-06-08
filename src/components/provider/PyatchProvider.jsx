import React, { useState, useEffect, useMemo, createContext } from "react";
import PyatchContext from "./PyatchContext.js";
import { PYATCH_EXECUTION_STATES, PYATCH_LOADING_MESSAGES } from "../../util/ExecutionState.js";
import Renderer from 'scratch-render';
import makeTestStorage from "../../util/make-test-storage.mjs";
import VirtualMachine from 'pyatch-vm';
import AudioEngine from 'scratch-audio';
import backdrops from '../../assets/backdrops.json';
import ScratchSVGRenderer from 'scratch-svg-renderer';


import sprite3ArrBuffer from '../../assets/cat.sprite3';

import { Buffer } from 'buffer-es6'
import PatchTopBar from "../PatchTopBar.jsx";

window.Buffer = Buffer;

const pyatchEditor = {};

export let pyatchVM = null;

let nextSpriteID = 1;

let persistentActiveSprite = 0;

let audioEngine = null;

let currentId = 0;

let noBackground = true;

const PyatchProvider = props => {
  let [sprites, setSprites] = useState([]);

  let [activeSprite, setActiveSpriteState] = useState(0);
  let [activeSpriteName, setActiveSpriteName] = useState();

  let [spriteX, setSpriteX] = useState(0);
  let [spriteY, setSpriteY] = useState(0);
  let [spriteSize, setSpriteSize] = useState(100);
  let [spriteDirection, setSpriteDirection] = useState(90);

  let [errorList, setErrorList] = useState([]);

  //returns array with each line of code for given sprite id
  pyatchEditor.getCodeLines = (sprite) => {
    let linesOfCode = [];
    let prev = 0;
    if(!pyatchEditor.editorText[sprite]){
      return [];
    }
    for(let i = 0; i < pyatchEditor.editorText[sprite].length; i++){
      if(pyatchEditor.editorText[sprite][i]=='\n'){
        linesOfCode.push(pyatchEditor.editorText[sprite].substring(prev, i));
        prev = i+1;
      }
    }
    linesOfCode.push(pyatchEditor.editorText[sprite].substring(prev, pyatchEditor.editorText[sprite].length));
    return linesOfCode;
  }


  function generateError(error){
    let line = error.line;
    let sprite = error.sprite;
    let linesOfCode = pyatchEditor.getCodeLines(sprite);
    let priorText = [];
    let afterText= [];
    for (let i=3; i>0; i--){
      if(line-i-1>=0 && line-i-1<linesOfCode.length)priorText.push(line-i+" "+linesOfCode[line-i-1]);
      if(line-i+3<linesOfCode.length)afterText.push(line-i+4+" "+linesOfCode[line-i+3]);
    }


    let currentError = {
      "uid" : currentId,
      "line" : line,
      "errName" : error.name,
      "priorText" : priorText,
      "afterText" : afterText,
      "sprite" : pyatchEditor.getSpriteName(sprite),
      "errCode" : line + " "+ linesOfCode[line-1]
    };
    currentId++;
    return currentError;
    
  }

  const pyatchSpriteValues = {
    x: spriteX, 
    y: spriteY, 
    size: spriteSize, 
    direction: spriteDirection
  };

  function changeSpriteValues(eventSource = null) {
    // only update the attributes if the active sprite has changes
    if (eventSource) {
      if (eventSource.id !== 'target' + persistentActiveSprite) {
        return;
      }
    }

    setSpriteX(pyatchVM.runtime.targets[persistentActiveSprite].x);
    setSpriteY(pyatchVM.runtime.targets[persistentActiveSprite].y);
    setSpriteSize(pyatchVM.runtime.targets[persistentActiveSprite].size);
    setSpriteDirection(pyatchVM.runtime.targets[persistentActiveSprite].direction);
  }

  [pyatchEditor.editorText, pyatchEditor.setEditorText] = useState([""]);
  [pyatchEditor.globalVariables, pyatchEditor.setGlobalVariables] = useState([]);

  [pyatchEditor.executionState, pyatchEditor.setExecutionState] = useState(PYATCH_EXECUTION_STATES.PRE_LOAD);

  [pyatchEditor.changesSinceLastSave, pyatchEditor.setChangesSinceLastSave] = useState(false);
  useEffect(() => {
    pyatchEditor.setChangesSinceLastSave(true);
  }, [sprites]);
    
  //https://dev.to/zachsnoek/creating-custom-react-hooks-useconfirmtabclose-eno
  const confirmationMessage = "You have unsaved changes. Continue?";
  useEffect(() => {
    const handleBeforeUnload = (event) => {
        if (pyatchEditor.changesSinceLastSave) {
            event.returnValue = confirmationMessage;
            return confirmationMessage;
        }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () =>
        window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [pyatchEditor.changesSinceLastSave]);

  pyatchEditor.startupBackground = async () => {
    await pyatchVM.addSprite(backdrops[0]);
    pyatchEditor.onBackgroundChange(12);
  }

  pyatchEditor.generateExecutionObject = () => {
    const executionObject = { };
    setErrorList([]);

    if(sprites)sprites.forEach((sprite) => {
      const targetEventMap = {};
      const spriteThreads = pyatchEditor.editorText[sprite];

      if(spriteThreads)spriteThreads.forEach((thread) => {
        if (thread.option === "") {
          targetEventMap[thread.eventId] = [...(targetEventMap[thread.eventId] ?? []), thread.code];
        } else {
          targetEventMap[thread.eventId] = {};
          targetEventMap[thread.eventId][thread.option] = [...(targetEventMap[thread.eventId][thread.option] ?? []), thread.code];
        }
      });
      executionObject['target' + sprite] = targetEventMap;
    });

    return executionObject;
  }
  
  pyatchEditor.onRunPress = async () => {
    const executionObject = pyatchEditor.generateExecutionObject();

    await pyatchVM.loadScripts(executionObject);
    await pyatchVM.startHats("event_whenflagclicked");

  }

  pyatchEditor.pyatchMessage = useMemo(() => PYATCH_LOADING_MESSAGES[pyatchEditor.executionState], [pyatchEditor.executionState]);
  pyatchEditor.runDisabled = false;
  pyatchEditor.addSpriteDisabled = false;
  pyatchEditor.stopDisabled = useMemo(() => pyatchEditor.executionState!=PYATCH_EXECUTION_STATES.RUNNING, [pyatchEditor.executionState]);

  const pyatchStage = {
    canvas: document.createElement('canvas'),
    height: 400,
    width: 600,
  };

  [pyatchEditor.eventLabels, pyatchEditor.setEventLabels] = useState({});
  [pyatchEditor.eventOptionsMap, pyatchEditor.setEventOptionsMap] = useState({});
  
  // runs once on window render
  useEffect(() => {
    function effect() {

      const scratchRenderer = new Renderer(pyatchStage.canvas);

      pyatchVM = new VirtualMachine(); 
      pyatchVM.attachRenderer(scratchRenderer);
      pyatchVM.attachStorage(makeTestStorage());
      pyatchVM.attachV2BitmapAdapter(new ScratchSVGRenderer.BitmapAdapter());

      pyatchEditor.setEventLabels(pyatchVM.getEventLabels());
      pyatchEditor.getEventOptions = pyatchVM.getEventOptionsMap.bind(pyatchVM);

      pyatchVM.runtime.draw();
      pyatchVM.start();

      if (!pyatchEditor.loadFromLocalStorage()) {
        pyatchEditor.onAddSprite();
      }

      /*Pass in an array of error objects with the folowing properties:
      * {
      *   "name" : the error text
      *   "line" : the integer of the line the error happended on
      *   "sprite" : the integer of the sprite the error happened on
      * }*/
      pyatchVM.on('ERROR_CAUGHT', (errors) => {
        let newErrs = [];
        for(let i=0; i < errors.length; i++){
          newErrs.push(generateError(errors[i]));
        }
        setErrorList(errorList.concat(newErrs));
      });
    }
    effect();
  
  }, []);

  pyatchEditor.onStopPress = () => {

  }

  function setActiveSprite(spriteID) {
    persistentActiveSprite = spriteID;
    setActiveSpriteState(spriteID);
  }

  pyatchEditor.onBackgroundChange = (index) => {
    pyatchVM.changeBackground(index);
  }
    
  pyatchEditor.onAddSprite = async () => {
    const sprite3 = Buffer.from(sprite3ArrBuffer);

    if(noBackground){
      await pyatchEditor.startupBackground();
      noBackground = false;
    }
    if(!audioEngine){
      audioEngine = new AudioEngine();
      pyatchVM.attachAudioEngine(audioEngine);
    }

    await pyatchVM.addSprite(sprite3);
    if(pyatchVM.runtime.targets[nextSpriteID])pyatchVM.runtime.targets[nextSpriteID].id = 'target' + nextSpriteID;

    // when RenderedTarget emits this event (anytime position, size, etc. changes), change sprite values
    if(pyatchVM.runtime.targets[nextSpriteID])pyatchVM.runtime.targets[nextSpriteID].on('EVENT_TARGET_VISUAL_CHANGE', changeSpriteValues);

    setSprites(() => [...sprites, nextSpriteID]);

    pyatchEditor.setEditorText(() => [...pyatchEditor.editorText, [{code: "", eventId: "event_whenflagclicked", option: ""}]]);

    setActiveSprite(nextSpriteID);

    nextSpriteID++;
    pyatchVM.runtime.renderer.draw();
  }


  pyatchEditor.onSelectSprite = (spriteID) => {
    setActiveSprite(spriteID);

    changeSpriteValues();
  }

  pyatchEditor.getSpriteName = (spriteID) => {
    if (pyatchVM) {
      return pyatchVM.runtime.getTargetById('target' + spriteID).getName();
    } else {
      return "No Sprite";
    }
  }

  pyatchEditor.setSpriteName = (name) => {
    if (pyatchVM) {
      pyatchVM.runtime.getTargetById('target' + activeSprite).sprite.name = name;
      setActiveSpriteName(name);
    }
  }

  pyatchEditor.getSerializedProject = async () => {
    // update scripts so changes since last run will persist
    const executionObject = pyatchEditor.generateExecutionObject();

    await pyatchVM.loadScripts(executionObject);
    if (pyatchVM) {
      return await pyatchVM.serializeProject();
    } else {
      return null;
    }
  }
  pyatchEditor.downloadProject = async () => {
    // update scripts so changes since last run will persist
    const executionObject = pyatchEditor.generateExecutionObject();

    await pyatchVM.loadScripts(executionObject);
    return pyatchVM.downloadProject();
  }

  pyatchEditor.loadSerializedProject = async (vmState) => {
    if (pyatchVM) {
      /* TODO: clear out old targets first */

      var oldTargets = pyatchVM.runtime.targets;
      var oldExecutableTargets = pyatchVM.runtime.executableTargets;
      var oldEventMap = pyatchVM.runtime.pyatchWorker._eventMap;
      var oldGlobalVariables = pyatchVM.runtime._globalVariables;

      pyatchVM.runtime.targets = [];
      pyatchVM.runtime.executableTargets = [];
      pyatchVM.runtime.pyatchWorker._eventMap = null;
      pyatchVM.runtime._globalVariables = {};

      nextSpriteID = 1;
      await pyatchEditor.startupBackground();

      var result = await pyatchVM.loadProject(vmState);

      if (result == null) {
        console.warn("Something went wrong and the GUI received a null value for the project to load. Aborting.");

        pyatchVM.runtime.targets = oldTargets;
        pyatchVM.runtime.executableTargets = oldExecutableTargets;
        pyatchVM.runtime.pyatchWorker._eventMap = oldEventMap;
        pyatchVM.runtime.pyatchWorker._globalVariables = oldGlobalVariables;

        return;
      }

      pyatchEditor.setGlobalVariables(result.json.globalVariables);

      pyatchEditor.onBackgroundChange(result.json.background);

      noBackground = false;

      var newTargetsCount = result.importedProject.targets.length;

      if(!audioEngine){
        audioEngine = new AudioEngine();
        pyatchVM.attachAudioEngine(audioEngine);
      }

      let newSprites = [];
      let newText = [];

      newText.push({});

      for (var i = 0; i < newTargetsCount; i++) {        
        // when RenderedTarget emits this event (anytime position, size, etc. changes), change sprite values
        await pyatchVM.runtime.targets[nextSpriteID].on('EVENT_TARGET_VISUAL_CHANGE', changeSpriteValues);

        pyatchVM.runtime.targets[nextSpriteID].id = 'target' + nextSpriteID;

        newSprites.push(nextSpriteID);

        let notPushed = false;

        // Time to generate code.
        if (result.json.code) {
          let smallJSON = result.json.code['target' + nextSpriteID];
          if (smallJSON != null) {
            let threads = [];
            /*let flagClick = smallJSON['event_whenflagclicked'];
            if (flagClick != null && flagClick.forEach instanceof Function) {
              var threadCount = flagClick.length;
              for (var j = 0; j < threadCount; j++) {
                threads[j] = {code: flagClick[j], eventId: 'event_whenflagclicked'};
              }
              /*flagClick.forEach(thread => {
                threads.push({code: thread, eventId: 'event_whenflagclicked'});
              });*//*
            }*/
            let keys = Object.keys(smallJSON);
            if (Array.isArray(keys)) {
              var keyCount = keys.length;
              for (var j = 0; j < keyCount; j++) {
                if (Array.isArray(smallJSON[keys[j]])) {
                  smallJSON[keys[j]].forEach(code => {
                    threads.push({code: code, eventId: keys[j], option: ''});
                  });
                } else {
                  let optionKeys = Object.keys(smallJSON[keys[j]]);
                  optionKeys.forEach(realKey => {
                    //threads.push({code: realCode, eventId: keys[j], option: code});
                    smallJSON[keys[j]][realKey].forEach(realCode => {
                      threads.push({code: realCode, eventId: keys[j], option: realKey});
                    })
                  });
                }
              }
            }
            newText.push(threads);
          } else {
            notPushed = true;
          }
        } else {
          notPushed = true;
        }
        if (notPushed) {
          newText.push([{code: '', eventId: 'event_whenflagclicked', option: ''}]);
        }

        nextSpriteID++;
      }

      setSprites(() => newSprites);
      pyatchEditor.setEditorText(() => newText);
      
      setActiveSprite(1);

      pyatchEditor.setChangesSinceLastSave(false);
    } else {
      //return null;
    }
  }

  pyatchEditor.saveToLocalStorage = async () => {
    // https://stackoverflow.com/questions/18650168/convert-blob-to-base64
    let proj = await pyatchEditor.getSerializedProject();
    var reader = new FileReader();
    reader.readAsDataURL(proj);
    reader.onloadend = function() {
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
    pyatchEditor.setChangesSinceLastSave(false);
  }

  // https://stackoverflow.com/questions/16245767/creating-a-blob-from-a-base64-string-in-javascript
  const b64dataurltoBlob = (b64Data, contentType='', sliceSize=512) => {
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
  
    const blob = new Blob(byteArrays, {type: contentType});
    return blob;
  }

  pyatchEditor.loadFromLocalStorage = () => {
    let text = localStorage.getItem("proj");
    if (text) {
      console.log("Loading from localStorage...");
      let proj = b64dataurltoBlob(text, 'application/zip');
      pyatchEditor.loadSerializedProject(proj);
      console.log("Loaded from localStorage...");
      return true;
    } else {
      console.warn("No project detected in localStorage.");
      return false;
    }
  }

  return (
   <>
   <PyatchContext.Provider
      value={{pyatchEditor, pyatchStage, pyatchSpriteValues, sprites, activeSprite, activeSpriteName, errorList, pyatchVM}}
    >
      {props.children}
    </PyatchContext.Provider>
    </>
  );
};

export default PyatchProvider;