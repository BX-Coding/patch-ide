import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  text: "print('Welcome to Pyatch 2.0!')",
}

const textEditorSlice = createSlice({
  name: 'textEditor',
  initialState,
  reducers: {
    updateText(state, action) {
      state.text = action.payload
    },
  }
})

export const { updateText } = textEditorSlice.actions

export default textEditorSlice.reducer