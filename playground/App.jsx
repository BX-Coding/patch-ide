import PyatchProvider from '../src/components/provider/PyatchProvider.jsx';
import {PyatchStartButton,  PyatchStopButton} from '../src/components/PyatchButton.jsx';
import PyatchStage from '../src/components/PyatchStage.jsx';
import PyatchSpriteArea from '../src/components/PyatchSpriteArea.jsx';
import Grid from '@mui/material/Grid';
import './App.css'
import PyatchEditor from '../src/components/PyatchEditor.jsx';

function App() {
  return (
    <PyatchProvider>
      <Grid container width={'100%'} spacing={2}>
        <Grid item xs={7}>
          <PyatchEditor/>
        </Grid>
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
        <Grid container item>
          <PyatchSpriteArea/>
        </Grid>
      </Grid>
    </PyatchProvider>
  )
}

export default App
