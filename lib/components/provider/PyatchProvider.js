import React, { useState } from "react";
import PyatchContext from "./PyatchContext";
import { PyatchWorker } from 'pyatch-worker'

const pyatchProvider = props => {
  const [state, setState] = useState({
    pyatchWorker: new PyatchWorker(),
    pyatchLinker: new PyatchLinker(),
    pyatchVM: new PyatchVM(),
    executionState: null,
    pyatchEditorValue: "print('hello world!')",
    onRunPress: onRunPress,
    onStopPress: onStopPress,
  });

  function onRunPress() {
    const target1 = {
        'id': 'target1',
        'code': state.pyatchEditorValue,
    }
    const linkedCode = state.pyatchLinker.generatePython(target1)
    const message = {
        id: "AsyncRun",
        token: "notneeded",
        python: linkedCode,
        targets: [target1],
    }
    state.pyatchWorker.postMessage(message)
  }

  function onStopPress() {

  }

  return (
   <PyatchContext.Provider
      value={{
        data: state,
        updateDeliveryStatus: () => {
          setState({ ...state, deliveryStatus: "Delivered" });
        }
      }}
    >
      {props.children}
    </PyatchContext.Provider>
  );
};

export default pyatchProvider;