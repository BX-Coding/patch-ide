import React, { useState,  useEffect, useMemo } from "react";
import PyatchContext from "./PyatchContext.js";
import { PYATCH_EXECUTION_STATES, PYATCH_LOADING_MESSAGES } from "../../util/ExecutionState.js";
import Renderer from 'scratch-render';
import makeTestStorage from "../../util/make-test-storage.mjs";
import VirtualMachine from 'pyatch-vm'

import sprite3ArrBuffer from '../../assets/cat.sprite3';

import { Buffer } from 'buffer-es6'

window.Buffer = Buffer;

const PyatchProvider = props => {

  const pyatchEditor = {};

  [pyatchEditor.editorText, pyatchEditor.setEditorText] = useState("print('hello world!')");

  [pyatchEditor.executionState, pyatchEditor.setExecutionState] = useState(PYATCH_EXECUTION_STATES.PRE_LOAD);
  [pyatchEditor.onRunPress] = useState(() => {
    console.log('running');
    // const targetsAndCode = [{
    //     'id': 'target1',
    //     'code': state.editorText,
    // }]
    // pyatchVM.run(targetsAndCode);
  }
);

  pyatchEditor.pyatchMessage = useMemo(() => PYATCH_LOADING_MESSAGES[pyatchEditor.executionState], [pyatchEditor.executionState]);
  pyatchEditor.runDisabled = useMemo(() => pyatchEditor.executionState!=PYATCH_EXECUTION_STATES.READY, [pyatchEditor.executionState]);
  pyatchEditor.stopDisabled = useMemo(() => pyatchEditor.executionState!=PYATCH_EXECUTION_STATES.RUNNING, [pyatchEditor.executionState]);


  const pyatchStage = {
    canvas: null,
    height: 400,
    width: 600,
  };

  useEffect(() => {
    async function useEffectAsync() {
      pyatchStage.canvas = document.createElement('canvas');
      const scratchRenderer = new Renderer(pyatchStage.canvas);

      const pyatchVM = new VirtualMachine(null);
      pyatchVM.attachRenderer(scratchRenderer);
      pyatchVM.attachStorage(makeTestStorage());

      const sprite3 = Buffer.from(sprite3ArrBuffer);

      await pyatchVM.addSprite(sprite3);
    }
    useEffectAsync();
    
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