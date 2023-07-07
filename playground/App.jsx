import PyatchProvider from '../src/components/provider/PyatchProvider.jsx';
import { PyatchStartButton, PyatchStopButton } from '../src/components/PyatchButton.jsx';
import PyatchStage from '../src/components/PyatchStage.jsx';
import PyatchSpriteArea from '../src/components/PyatchSpriteArea.jsx';
import Grid from '@mui/material/Grid';
import './App.css'
import PatchTopBar from '../src/components/PatchTopBar.jsx';
import { PatchEditorPane, PatchSpriteTabButton, PatchCodeEditorTabButton } from '../src/components/PatchEditorPane.jsx';

function App() {
  return (
    <PyatchProvider>
      <Grid container item direction="row" width={'100%'} spacing={"8px"} style={{
        position: "absolute",
        width: "100%",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        padding: 0,
        margin: 0,
        paddingBottom: 8,
        paddingRight: 8,
        zIndex: -1,
        overflowY: "scroll"
      }}>
        <Grid container direction="row" xs={12} style={{ marginTop: 8, marginRight: 0, marginBottom: 0, marginLeft: 8, maxHeight: 48 }}>
          <PatchTopBar />
        </Grid>
        <Grid item class="leftContainer">
          <Grid container spacing="4px" marginBottom="4px">
            <Grid item><PatchCodeEditorTabButton /></Grid>
            <Grid item><PatchSpriteTabButton /></Grid>
          </Grid>
          <Grid item>
            <PatchEditorPane />
          </Grid>
        </Grid>
        <Grid item class="rightContainer">
          <Grid container spacing={2} direction="row">
            <Grid item>
              <PyatchStartButton />
            </Grid>
            <Grid item>
              <PyatchStopButton />
            </Grid>
          </Grid>
          <Grid container justifyContent="center">
            <Grid item xs={12}>
              <PyatchStage />
            </Grid>
            <Grid item xs={12}>
              <PyatchSpriteArea />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <div id="testItem" style={{ zIndex: 2 }}>

      </div>
    </PyatchProvider>
  );
}

export default App;