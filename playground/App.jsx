import PyatchProvider from '../src/components/provider/PyatchProvider.jsx';
import { PyatchStartButton, PyatchStopButton } from '../src/components/PyatchButton.jsx';
import PyatchStage from '../src/components/PyatchStage.jsx';
import PyatchSpriteArea from '../src/components/PyatchSpriteArea.jsx';
import Grid from '@mui/material/Grid';
import './App.css'
import PatchTopBar from '../src/components/PatchTopBar.jsx';
import { PatchEditorPane, PatchSpriteTabButton, PatchCodeEditorTabButton, PatchSoundTabButton } from '../src/components/PatchEditorPane.jsx';

import { PatchHorizontalButtons } from '../src/components/PatchTemplates.jsx';

function App() {
  return (
    <PyatchProvider>
      <Grid container item direction="row" width={'100%'} style={{
        position: "absolute",
        width: "100%",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 0,
        margin: 0,
        padding: "8px",
        zIndex: -1,
        overflowY: "scroll"
      }}>
        <PatchTopBar />
        <Grid item class="leftContainer">
          <PatchHorizontalButtons>
            <PatchCodeEditorTabButton />
            <PatchSpriteTabButton />
            <PatchSoundTabButton />
          </PatchHorizontalButtons>
          <PatchEditorPane />
        </Grid>
        <Grid item class="rightContainer">
          <PatchHorizontalButtons>
            <PyatchStartButton />
            <PyatchStopButton />
          </PatchHorizontalButtons>
          <PyatchStage />
          <PyatchSpriteArea />
        </Grid>
      </Grid>
      <div id="testItem" style={{ zIndex: 2 }}>

      </div>
    </PyatchProvider>
  );
}

export default App;