import { createSlice } from '@reduxjs/toolkit'
import PyodideStates from './pyodideConstants';

const initialState = {
  status: PyodideStates.PRE_LOAD,
  pyodideGlobal: null,
  
}

const pyodideSlice = createSlice({
  name: 'pyodide',
  initialState,
  reducers: {
    pyodideUpdateStatus(state, action) {
      state.status = action.payload
    },
  }
})

export const { pyodideUpdateStatus } = pyodideSlice.actions

export default pyodideSlice.reducer