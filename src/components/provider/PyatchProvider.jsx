import React, { useState, useEffect, useMemo } from "react";
import PyatchContext from "./PyatchContext.js";
import { PYATCH_EXECUTION_STATES, PYATCH_LOADING_MESSAGES } from "../../util/ExecutionState.js";
import Renderer from 'scratch-render';
import makeTestStorage from "../../util/make-test-storage.mjs";
import VirtualMachine from 'pyatch-vm';
import { updateState }  from "../PyatchEditor.jsx";

import sprite3ArrBuffer from '../../assets/cat.sprite3';

import { Buffer } from 'buffer-es6'

window.Buffer = Buffer;

const pyatchEditor = {};

let pyatchVM = null;

let nextSpriteID = 0;

const PyatchProvider = props => {

  let [sprites, setSprites] = useState([]);

  let [activeSprite, setActiveSprite] = useState();

  let [spriteX, setSpriteX] = useState(0);
  let [spriteY, setSpriteY] = useState(0);
  let [spriteSize, setSpriteSize] = useState(100);
  let [spriteDirection, setSpriteDirection] = useState(90);

  const pyatchSpriteValues = [spriteX, spriteY, spriteSize, spriteDirection];

  function changeSpriteValues() {
    setSpriteX(pyatchVM.runtime.targets[activeSprite].x);
    setSpriteY(pyatchVM.runtime.targets[activeSprite].y);
  }

  [pyatchEditor.editorText, pyatchEditor.setEditorText] = useState([]);

  [pyatchEditor.executionState, pyatchEditor.setExecutionState] = useState(PYATCH_EXECUTION_STATES.PRE_LOAD);
  pyatchEditor.onRunPress = () => {
    const threadsAndCode = { };

    sprites.forEach((sprite) => {
      threadsAndCode['target' + sprite] = pyatchEditor.editorText[sprite];
    });

    console.log(threadsAndCode);

    pyatchVM.run(threadsAndCode);

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
  
  // runs once on window render
  useEffect(() => {
    function effect() {

      const scratchRenderer = new Renderer(pyatchStage.canvas);

      pyatchVM = new VirtualMachine(null); 
      pyatchVM.attachRenderer(scratchRenderer);
      pyatchVM.attachStorage(makeTestStorage());

      pyatchVM.runtime.renderer.draw();

    }
    effect();
  
  }, []);
  

  pyatchEditor.onStopPress = () => {

  }

  pyatchEditor.onAddSprite = async () => {
    const sprite3 = Buffer.from(sprite3ArrBuffer);

    await pyatchVM.addSprite(sprite3);

    pyatchVM.runtime.targets[nextSpriteID].id = 'target' + nextSpriteID;

    // when RenderedTarget emits this event (anytime position, size, etc. changes), change sprite values
    pyatchVM.runtime.targets[0].on('EVENT_TARGET_VISUAL_CHANGE', changeSpriteValues);

    setSprites(() => [...sprites, nextSpriteID]);

    pyatchEditor.setEditorText(() => [...pyatchEditor.editorText, ""]);

    setActiveSprite(nextSpriteID);

    nextSpriteID++;

    pyatchVM.runtime.renderer.draw();

  }

  pyatchEditor.onSelectSprite = (spriteID) => {
    
    setActiveSprite(spriteID);

    changeSpriteValues(pyatchEditor.editorText[spriteID]);

  }

  return (
   <PyatchContext.Provider
      value={{pyatchEditor, pyatchStage, pyatchSpriteValues, sprites, activeSprite}}
    >
      {props.children}
    </PyatchContext.Provider>
  );
};

export default PyatchProvider;