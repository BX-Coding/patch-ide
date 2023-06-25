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
      <Grid container item direction="row" width={'100%'} height={'100%'} spacing={"8px"} sx={{
        position: "absolute",
        width: "100%",
        height: "100%",
        top: "0",
        left: "0",
        right: "0",
        bottom: "0",
        padding: "8px"
      }} style={{zIndex: -1}}>
        <Grid container direction="row" xs={12} margin={"8px 8px 0px 8px"} maxHeight={"48px"}>
          <PatchTopBar />
        </Grid>
        <Grid item class="leftContainer">
          <Grid container spacing="4px" marginBottom="4px">
            <Grid item><PatchCodeEditorTabButton/></Grid>
            <Grid item><PatchSpriteTabButton/></Grid>
          </Grid>
          <Grid item>
            <PatchEditorPane/>
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
      <div id="testItem" style={{zIndex: 2}}>
        
        </div>
    </PyatchProvider>
  );
}

export default App;