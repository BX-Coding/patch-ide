import { useState } from 'react'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button'
import CodeMirror from '@uiw/react-codemirror';
import { python } from '@codemirror/lang-python';
import './App.css'

function App() {

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <CodeMirror
          value="console.log('hello world!');"
          extensions={[python()]}
          onChange={onChange}
        />
      </Grid>
      <Grid item xs={8}>
        <Button variant="contained">Run</Button>
      </Grid>
    </Grid>
  )
}

export default App
