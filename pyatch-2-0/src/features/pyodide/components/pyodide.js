import { useContext, useEffect, useState } from 'react'
//import Head from 'next/head'
import Script from 'next/script'
import { PyodideContext } from './pyodide-provider'
import PyodideStates from '../../../constants/pyodideStates'
import { useSelector, useDispatch } from 'react-redux';
import { pyodideUpdateStatus } from '../pyodideSlice';
import { asyncRun } from "../pyodideWorker";

export default function Pyodide({
  id,
  pythonCode,
  status,
  jsModules,
  loadingMessage = 'waiting for run...',
  evaluatingMessage = 'evaluating...'
}) {
  const indexURL = 'https://cdn.jsdelivr.net/pyodide/v0.21.3/full/'
  const {
    pyodide,
    hasLoadPyodideBeenCalled,
    isPyodideLoading,
    setIsPyodideLoading
  } = useContext(PyodideContext)
  const [pyodideOutput, setPyodideOutput] = useState(evaluatingMessage)
  const dispatch = useDispatch()

  // load pyodide wasm module and initialize it
  useEffect(() => {
    if (status == PyodideStates.PRE_LOAD) {
      // immediately set hasLoadPyodideBeenCalled ref, which is part of context, to true
      // this prevents any additional Pyodide components from calling loadPyodide a second time
      dispatch(pyodideUpdateStatus(PyodideStates.LOADING))
      ;(async function () {
        pyodide.current = await window.loadPyodide({ indexURL })
        // updating value of isPyodideLoading triggers second useEffect
        dispatch(pyodideUpdateStatus(PyodideStates.IDLE))
      })()
    }
    // pyodide and hasLoadPyodideBeenCalled are both refs and setIsPyodideLoading is a setState function (from context)
    // as a result, these dependencies will be stable and never cause the component to re-render
  }, [pyodide, status])

  // evaluate python code with pyodide and set output
  useEffect(() => {
    if (status === PyodideStates.RUNNING) {
      const evaluatePython = async (pyodide, pythonCode) => {
        pyodide.registerJsModule("bridge", jsModules["bridge"])
        try {
          return await pyodide.runPython(pythonCode)
        } catch (error) {
          console.error(error)
          return 'Error evaluating Python code. See console for details.'
        }
      }
      ;(async function () {
        const output = await evaluatePython(pyodide.current, pythonCode)
        dispatch(pyodideUpdateStatus(PyodideStates.IDLE))
        setPyodideOutput(output)
      })()
    }
    // component re-renders when isPyodideLoading changes, which is set with first useEffect and updated via context
  }, [status])

  return (
    <>
      <div id={id}>
        Pyodide Output: {status===PyodideStates.IDLE ? loadingMessage : pyodideOutput}
      </div>
    </>
  )
}