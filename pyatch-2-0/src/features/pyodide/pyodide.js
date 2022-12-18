import { useContext, useEffect, useState } from 'react'
//import Head from 'next/head'
import Script from 'next/script'
import {PyodideStates, PYODIDE_INDEX_URL, pyodideMessageDict} from './pyodideConstants'
import { useSelector, useDispatch } from 'react-redux';
import { pyodideUpdateStatus } from './pyodideSlice';
import { asyncRun } from "./pyodideWorkerAPI";

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
      asyncRun(pythonCode, jsContext).then((data) => {
        setPyodideOutput(data.results)
        dispatch(pyodideUpdateStatus(PyodideStates.READY))
      }).catch((error) => {
        setPyodideOutput(error)
        dispatch(pyodideUpdateStatus(PyodideStates.READY))
      })
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