import { useState } from 'react'
import PyatchProvider from '../src/components/provider/PyatchProvider.jsx';
import { PyatchStartButton,  PyatchStopButton} from '../src/components/PyatchButton.jsx';
import PyatchStage from '../src/components/PyatchStage.jsx';
import Grid from '@mui/material/Grid';
import './App.css'
import { PyatchCodeEditor } from '../src/components/PyatchEditor.jsx';
import { default as PatchFileButton } from '../src/components/PatchFileButton.jsx';
import { default as PatchFileName } from '../src/components/PatchFileName.jsx';
import { default as PatchProjectButton } from '../src/components/PatchProjectButton.jsx';
import { default as PatchSignOutButton } from '../src/components/PatchSignOutButton.jsx';

function App() {

  return (
    <PyatchProvider>
      <Grid container width={'100%'} spacing={2}>
        <Grid container item direction = "row" xs = {8} spacing={2}>
          <Grid item>
            <PatchFileButton/>
          </Grid>
          <Grid item xs={6}>
            <PatchFileName/>
          </Grid>
        </Grid>
        <Grid container item direction = "row" xs = {4} spacing = {2} justifyContent = "flex-end">
          <Grid item>
            <PatchProjectButton/>
          </Grid>
          <Grid item>
            <PatchSignOutButton/>
          </Grid>
        </Grid>
        <Grid item xs={7}>
          <PyatchCodeEditor/>
        </Grid>
        <Grid container item direction="column" xs={4} spacing={2}>
          <Grid container item spacing={2}>
            <Grid item>
              <PyatchStartButton/>
            </Grid>
            <Grid item>
            <PyatchStopButton/>
            </Grid>
          </Grid>
          <Grid container item xs={6}>
          <PyatchStage/>
          </Grid>
        </Grid>
      </Grid>
    </PyatchProvider>
  )
}

export default App
