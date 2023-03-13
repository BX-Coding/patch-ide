import React, { useState,  useEffect } from "react";
import PyatchContext from "./PyatchContext";
import { PyatchWorker } from 'pyatch-worker'
import { PyatchLinker } from 'pyatch-linker'
import { PYATCH_LOADING_STATES, PYATCH_LOADING_MESSAGES } from "../../util/ExecutionState";

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

  useEffect(() => {
    const pyatchWorker = new PyatchWorker();
    const pyatchLinker = new PyatchLinker();
    const scratchRenderer = new ScratchRenderer();
    pyatchVM = new PyatchVM();
    pyatchVM.attachWorker(pyatchWorker);
    pyatchVM.attachLinker(pyatchLinker);
    pyatchVM.attachRenderer(scratchRenderer);
    pyatchVM.setPyodideStateCallback((state) => {
      pyatchEditor.setButtonStates({
        runDisabled: state !== PYATCH_LOADING_STATES.READY,
        stopDisabled: state !== PYATCH_LOADING_STATES.RUNNING,
      });
      pyatchEditor.setPyatchMessage(PYATCH_LOADING_MESSAGES[state]);
      pyatchEditor.setExecutionState(state);
    });

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
      value={{pyatchEditor}}
    >
      {props.children}
    </PyatchContext.Provider>
  );
};

export default PyatchProvider;