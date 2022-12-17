import { configureStore } from '@reduxjs/toolkit'

import textEditorReducer from './features/textEditor/textEditorSlice'
import pyodideStateReducer from './features/pyodide/pyodideSlice'

const store = configureStore({
  reducer: {
    textEditor: textEditorReducer,
    pyodideState: pyodideStateReducer,
  }
})

export default store