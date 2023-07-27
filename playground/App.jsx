import React from 'react';
import PyatchProvider from '../src/components/provider/PatchProvider.jsx';
import { StartButton, StopButton } from '../src/components/ControlButton.jsx';
import Stage from '../src/components/Stage.jsx';
import SpritePane from '../src/components/SpritePane.jsx';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import './App.css'
import PatchTopBar from '../src/components/TopBar.jsx';
import { EditorPane, SpriteTabButton, CodeEditorTabButton, SoundTabButton, GlobalVariablesTabButton } from '../src/components/EditorPane.jsx';

import { HorizontalButtons } from '../src/components/PatchButtons.jsx';

import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';

import dark from '../src/themes/dark.json';
import light from '../src/themes/light.json';

function App() {
  const lightTheme = createTheme(light);
  const darkTheme = createTheme(dark);

  /*palette: {
      mode: 'dark',
      primary: {
        main: '#1976d2',
        light: '#42a5f5',
        dark: '#1565c0'
      },
      secondary: {
        main: '#9c27b0',
        light: '#ba68c8',
        dark: '#7b1fa2'
      },
      error: {
        main: '#d32f2f',
        light: '#ef5350',
        dark: '#c62828',
        contrastText: '#fff'
      },
      warning: {
        main: '#ed6c02',
        light: '#ff9800',
        dark: '#e65100',
        contrastText: '#fff'
      },
      info: {
        main: '#0288d1',
        light: '#03a9f4',
        dark: '#01579b',
        contrastText: '#fff'
      },
      panel: {
        default: 'rgba(0, 0, 0, 0.16)'
      }
    },*/

  // This holds information about dark mode/light mode
  const [mode, setMode] = React.useState(localStorage.getItem("theme") || "dark");

  return (
    <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
      <PyatchProvider>
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
          <PatchTopBar mode={mode} setMode={setMode} />
          <Grid item class="leftContainer">
            <Grid item container className="assetHolder" sx={{
              paddingTop: "8px",
              paddingLeft: "8px",
              paddingRight: "8px",
              paddingBottom: "2px",
              borderBottomWidth: "1px",
              borderColor: 'divider',
            }}>
              <HorizontalButtons>
                <CodeEditorTabButton />
                <SpriteTabButton />
                <SoundTabButton />
                <GlobalVariablesTabButton />
              </HorizontalButtons>
            </Grid>
            <EditorPane />
          </Grid>
          <Grid item class="rightContainer">
            <Grid item container className="assetHolder" sx={{
              paddingTop: "8px",
              paddingLeft: "8px",
              paddingRight: "8px",
              paddingBottom: "2px",
              borderBottomWidth: "1px",
              borderLeftWidth: "1px",
              borderColor: 'divider',
            }}>
              <HorizontalButtons>
                <StartButton />
                <StopButton />
              </HorizontalButtons>
            </Grid>
            <Box className="assetHolder" sx={{
              backgroundColor: 'panel.default',
              padding: "8px",
              minHeight: "calc(100% - 67px)",
              borderLeftWidth: "1px",
              borderColor: 'divider',
            }}>
              <Box className="canvasBox" sx={{
                backgroundColor: 'panel.default',
                borderColor: 'divider',
                borderRadius: "8px",
                overflow: "clip",
              }}>
                <Stage />
              </Box>
              <SpritePane />
            </Box>
          </Grid>
        </Grid>
        <div id="testItem" style={{ zIndex: 2 }}>

        </div>
      </PyatchProvider>
    </ThemeProvider>
  );
}

export default App;