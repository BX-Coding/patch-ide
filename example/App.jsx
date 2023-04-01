import { useState } from 'react'
import PyatchProvider from '../src/components/provider/PyatchProvider.jsx';
import { PyatchStartButton } from '../src/components/PyatchButton.jsx';
import { PyatchStage } from '../src/components/PyatchStage.jsx';
import Grid from '@mui/material/Grid';
import './App.css'

function App() {

  return (
    <PyatchProvider>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <PyatchStage/>
        </Grid>
        <Grid item xs={8}>
          <PyatchStartButton/>
        </Grid>
      </Grid>
    </PyatchProvider>
  )
}

export default App
