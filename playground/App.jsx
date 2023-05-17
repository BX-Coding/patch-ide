import { useState } from 'react'
import PyatchProvider from '../src/components/provider/PyatchProvider.jsx';
import { PyatchStartButton,  PyatchStopButton} from '../src/components/PyatchButton.jsx';
import PyatchStage from '../src/components/PyatchStage.jsx';
import Grid from '@mui/material/Grid';
import './App.css'
import { PyatchCodeEditor } from '../src/components/PyatchEditor.jsx';
import PatchVariables from '../src/components/PatchVariables.jsx';

function App() {

  return (
    <PyatchProvider>
      <Grid container width={'100%'} spacing={2}>
        <Grid item xs={1.5}>
          <PatchVariables/>
        </Grid>
        <Grid item xs={6}>
          <PyatchCodeEditor/>
        </Grid>
        <Grid container item direction="column" xs={4.5} spacing={2}>
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