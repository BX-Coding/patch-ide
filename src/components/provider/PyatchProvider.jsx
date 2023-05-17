import React, { useState,  useEffect, useMemo } from "react";
import PyatchContext from "./PyatchContext.js";
import { PYATCH_EXECUTION_STATES, PYATCH_LOADING_MESSAGES } from "../../util/ExecutionState.js";
import Renderer from 'scratch-render';
import makeTestStorage from "../../util/make-test-storage.mjs";
import VirtualMachine from 'pyatch-vm'
import {globalVar} from '../PatchVariables.jsx'

import sprite3ArrBuffer from '../../assets/cat.sprite3';

import { Buffer } from 'buffer-es6'

window.Buffer = Buffer;

const PyatchProvider = props => {

  const pyatchEditor = {};
  let pyatchVM = null;

  [pyatchEditor.editorText, pyatchEditor.setEditorText] = useState("move(10)");

  [pyatchEditor.executionState, pyatchEditor.setExecutionState] = useState(PYATCH_EXECUTION_STATES.PRE_LOAD);
  pyatchEditor.onRunPress = () => {
    const targetsAndCode = {
      'target1': [pyatchEditor.editorText],
    }
    pyatchVM.run(targetsAndCode, globalVar);
  }

  pyatchEditor.pyatchMessage = useMemo(() => PYATCH_LOADING_MESSAGES[pyatchEditor.executionState], [pyatchEditor.executionState]);
  pyatchEditor.runDisabled = false;
  pyatchEditor.stopDisabled = useMemo(() => pyatchEditor.executionState!=PYATCH_EXECUTION_STATES.RUNNING, [pyatchEditor.executionState]);


  const pyatchStage = {
    canvas: document.createElement('canvas'),
    height: 400,
    width: 600,
  };

  useEffect(() => {
    async function effectAsync() {
      const scratchRenderer = new Renderer(pyatchStage.canvas);

      pyatchVM = new VirtualMachine(null);
      pyatchVM.attachRenderer(scratchRenderer);
      pyatchVM.attachStorage(makeTestStorage());

      const sprite3 = Buffer.from(sprite3ArrBuffer);

      await pyatchVM.addSprite(sprite3);

      pyatchVM.runtime.targets[0].id = 'target1'

      pyatchVM.runtime.renderer.draw();
    }
    effectAsync();
    
  }, []);

  pyatchEditor.onStopPress = () => {

  }

  return (
   <PyatchContext.Provider
      value={{pyatchEditor, pyatchStage}}
    >
      {props.children}
    </PyatchContext.Provider>
  );
};

export default PyatchProvider;