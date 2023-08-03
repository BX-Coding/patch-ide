import React from 'react';
import SpritePane from '../SpritePane';
import { Box, Grid, createTheme } from '@mui/material';
import './style.css'
import { TopBar } from '../TopBar';
import { EditorPane, EditorTabButton } from '../EditorPane';
import { HorizontalButtons } from '../PatchButton';
import { ThemeProvider } from '@emotion/react';

import darkTheme from '../../themes/dark';
import lightTheme from '../../themes/light';
import { GamePane } from '../GamePane';
import { EditorTab } from '../../store/patchEditorStore';

const App = () => {
  // This holds information about dark mode/light mode
  const [mode, setMode] = React.useState(localStorage.getItem("theme") || "dark");

  return (
    <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
        <Grid container item direction="row" width={'100%'} sx={{
          position: "absolute",
          width: "100%",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          padding: 0,
          margin: 0,
          paddingBottom: "0px",
          zIndex: -1,
          overflowY: "auto",
          backgroundColor: 'background.default'
        }}>
          <TopBar mode={mode} setMode={setMode} />
          <Grid item className="leftContainer">
            <Grid item container className="assetHolder" sx={{
              paddingTop: "8px",
              paddingLeft: "8px",
              paddingRight: "8px",
              paddingBottom: "2px",
              borderBottomWidth: "1px",
              borderColor: 'divider',
            }}>
              <HorizontalButtons>
                <EditorTabButton tab={EditorTab.CODE} />
                <EditorTabButton tab={EditorTab.COSTUMES}/>
                <EditorTabButton tab={EditorTab.SOUNDS}/>
                <EditorTabButton tab={EditorTab.VARIABLES}/>
              </HorizontalButtons>
            </Grid>
            <EditorPane />
          </Grid>
          <Grid item className="rightContainer">
            <GamePane />
            <SpritePane />
          </Grid>
        </Grid>
    </ThemeProvider>
  );
}

export default App;