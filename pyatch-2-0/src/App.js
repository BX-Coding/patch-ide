import './assets/css/App.css';
import React, { useState, useEffect, useMemo, useRef } from "react";
import { python } from "@codemirror/lang-python";
import Pyodide from "./features/pyodide/components/pyodide";
import { Bridge } from './scripts/ScratchBridge';
import { useSelector, useDispatch } from 'react-redux';
import { updateText } from './features/textEditor/textEditorSlice';
import CodeMirror from '@uiw/react-codemirror';
import { pyodideUpdateStatus } from './features/pyodide/pyodideSlice';
import PyodideStates from './constants/pyodideStates';

function App() {
  const ideText = useSelector((state) => state.textEditor.text);
  const pyodideStatus = useSelector((state) => state.pyodideState.status);
  //console.log("Pyodide Status: " + pyodideStatus);
  const dispatch = useDispatch()

  const onChange = React.useCallback((value, viewUpdate) => {
    dispatch(updateText(value));
  }, []);

  return (
    <>
      <CodeMirror
        value={ideText}
        height="200px"
        extensions={[python()]}
        onChange={onChange}
      />
      <button onClick={() => {dispatch(pyodideUpdateStatus(PyodideStates.RUNNING));}}>Run</button>
      <Pyodide pythonCode={ideText} status={pyodideStatus} jsModules={{"bridge": Bridge}} />
    </>
  );
}

export default App;
