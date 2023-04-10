import React, { useState,  useEffect } from "react";
import PyatchContext from "./PyatchContext.js";
import { PYATCH_LOADING_STATES, PYATCH_LOADING_MESSAGES } from "../../util/ExecutionState.js";
import Renderer from 'scratch-render';
import makeTestStorage from "../../util/make-test-storage.mjs";
import VirtualMachine from 'pyatch-vm'

const PyatchProvider = props => {
  let pyatchVM = null;

  const pyatchEditor = {};

  [pyatchEditor.executionState, pyatchEditor.setExecutionState] = useState("stopped");
  [pyatchEditor.editorText, pyatchEditor.setEditorText] = useState("print('hello world!')");
  [pyatchEditor.pyatchMessage, pyatchEditor.setPyatchMessage] = useState(PYATCH_LOADING_MESSAGES[PYATCH_LOADING_STATES.PRE_LOAD]);
  [pyatchEditor.buttonStates, pyatchEditor.setButtonStates] = useState({
    runDisabled: false,
    stopDisabled: true,
  });

  const pyatchStage = {
    canvas: null,
  };

  useEffect(async () => {
    pyatchStage.canvas = document.createElement('canvas');
    const scratchRenderer = new Renderer(pyatchStage.canvas);

    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);

    const PATH_TO_PYODIDE = path.join(__dirname, '../../node_modules/pyodide');
    const PATH_TO_WORKER = path.join(__dirname, '../../src/worker/pyodide-web-worker.mjs');

    const pyatchVM = new VirtualMachine(PATH_TO_PYODIDE, PATH_TO_WORKER);
    pyatchVM.attachRenderer(scratchRenderer);
    pyatchVM.attachStorage(makeTestStorage());

    const sprite3Uri = path.resolve(__dirname, '../../assets/cat.sprite3');
    const sprite3 = readFileToBuffer(sprite3Uri);

    await pyatchVM.addSprite(sprite3);
  }, []);


  pyatchEditor.onRunPress = () => {
    const targetsAndCode = [{
        'id': 'target1',
        'code': state.editorText,
    }]

    pyatchVM.run(targetsAndCode);

  }

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