import { useContext, useEffect, useRef, useState } from 'react'
import {PyodideStates, PYODIDE_INDEX_URL, pyodideMessageDict} from './pyodideConstants'
import { useSelector, useDispatch } from 'react-redux';
import { pyodideUpdateStatus } from './pyodideSlice';
import { pyodideWorker } from "./pyodideWorker";

export default function Pyodide({
  id,
  pythonCode,
  status,
  jsModules: jsContext,
  messageDict = pyodideMessageDict,
}) {
  const indexURL = PYODIDE_INDEX_URL
  const [pyodideOutput, setPyodideOutput] = useState(messageDict[status])
  const dispatch = useDispatch() 

  // evaluate python code with pyodide and set output
  useEffect(() => {
    setPyodideOutput(messageDict[status])
    if (status === PyodideStates.RUNNING) {
      pyodideWorker.asyncRun(pythonCode, jsContext).then((data) => {
        if (data.error) {
          console.log(data.error)
        }
        dispatch(pyodideUpdateStatus(PyodideStates.READY))
      }).catch((error) => {
        setPyodideOutput(error)
        dispatch(pyodideUpdateStatus(PyodideStates.READY))
      })
    } else if ( status === PyodideStates.HALTING) {
      pyodideWorker.halt()
      dispatch(pyodideUpdateStatus(PyodideStates.READY))
    }
  }, [status])

  return (
    <>
      <div id={id}>
        Pyodide Output: {pyodideOutput}
      </div>
    </>
  )
}