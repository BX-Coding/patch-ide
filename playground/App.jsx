import PyatchProvider from '../src/components/provider/PyatchProvider.jsx';
import {PyatchStartButton,  PyatchStopButton} from '../src/components/PyatchButton.jsx';
import PyatchStage from '../src/components/PyatchStage.jsx';
import PyatchSpriteArea from '../src/components/PyatchSpriteArea.jsx';
import Grid from '@mui/material/Grid';
import './App.css'
import PyatchEditor from '../src/components/PyatchEditor.jsx';
import PatchTopBar from '../src/components/PatchTopBar.jsx';
import { PatchEditor, PatchCodeEditorTabButton, PatchSpriteEditorTabButton } from '../src/components/PatchEditor.jsx';

function App() {
  return (
    <PyatchProvider>
      <Grid container item direction = "row" width={'100%'} spacing={2}>
        <Grid container item direction ="row" xs={12}>
          <PatchTopBar/>
        </Grid>
        <Grid item xs={1}>
              <Grid><PatchCodeEditorTabButton/></Grid>
              <Grid><PatchSpriteEditorTabButton/></Grid>
        </Grid>
        <Grid item xs={2}>
              <PatchEditor/>
        </Grid>
          <Grid item xs={5}>
            <PyatchEditor/>
          </Grid>
          <Grid item xs={4}>
            <Grid container spacing={2} item direction = "row">
              <Grid item>
                <PyatchStartButton/>
              </Grid>
              <Grid item>
                <PyatchStopButton/>
              </Grid>
            </Grid>
            <Grid container justifyContent="center">
              <Grid item xs={12}>
                <PyatchStage/>
              </Grid>
              <Grid item xs={12}>
                <PyatchSpriteArea/>
              </Grid>
            </Grid>
          </Grid>
      </Grid>
    </PyatchProvider>
  );
}

export default App;
