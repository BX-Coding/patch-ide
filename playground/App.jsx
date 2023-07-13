import React from 'react';
import PyatchProvider from '../src/components/provider/PyatchProvider.jsx';
import { PyatchStartButton, PyatchStopButton } from '../src/components/PyatchButton.jsx';
import PyatchStage from '../src/components/PyatchStage.jsx';
import PyatchSpriteArea from '../src/components/PyatchSpriteArea.jsx';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/material';
import './App.css'
import PatchTopBar from '../src/components/PatchTopBar.jsx';
import { PatchEditorPane, PatchSpriteTabButton, PatchCodeEditorTabButton, PatchSoundTabButton } from '../src/components/PatchEditorPane.jsx';

import { PatchHorizontalButtons } from '../src/components/PatchTemplates.jsx';

import { ThemeProvider } from '@emotion/react';
import { createTheme } from '@mui/material';

function App() {
  const lightTheme = createTheme({
    palette: {
      mode: 'light',
      panel: {
        default: 'rgba(255, 255, 255, 0.08)'
      },
      background: {
        paper: '#DDDDDD',
        default: '#DDDDDD'
      }
    }
  })
  const darkTheme = createTheme({
    palette: {
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
      text: {
        primary: '#fff',
        secondary: 'rgba(255, 255, 255, 0.7)',
        disabled: 'rgba(255, 255, 255, 0.5)',
        icon: 'rgba(255, 255, 255, 0.5)'
      },
      background: {
        paper: '#242424',
        default: '#242424'
      },
      panel: {
        default: 'rgba(0, 0, 0, 0.16)',
        contrast: '#FFFFFF'
      },
      outlinedButtonBorder: {
        default: 'rgba(255, 255, 255, 0.16)'
      }
    },
    shape: {
      "borderRadius": 8
    },
    components: {
      MuiButton: {
        "defaultProps": {
          "disableElevation": true
        },
        "styleOverrides": {},
        "variants": [
          {
            "props": {
              "variant": "code"
            }
          },
          {
            "props": {
              "variant": "link"
            }
          }
        ]
      }
    }
  });

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
  const [mode, setMode] = React.useState('dark');

  //setMode(localStorage.getItem('themeMode') || 'dark');

  return (
    <PyatchProvider>
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
          padding: "0px",
          paddingBottom: "0px",
          zIndex: -1,
          overflowY: "scroll",
          backgroundColor: 'background.default'
        }}>
          <PatchTopBar />
          <Grid item class="leftContainer">
            <Grid item container className="assetHolder" sx={{
              paddingTop: "8px",
              paddingLeft: "8px",
              paddingRight: "8px",
              paddingBottom: "2px",
              borderBottomWidth: "1px",
              borderColor: 'divider',
            }}>
              <PatchHorizontalButtons>
                <PatchCodeEditorTabButton />
                <PatchSpriteTabButton />
                <PatchSoundTabButton />
              </PatchHorizontalButtons>
            </Grid>
            <PatchEditorPane />
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
              <PatchHorizontalButtons>
                <PyatchStartButton />
                <PyatchStopButton />
              </PatchHorizontalButtons>
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
                <PyatchStage />
              </Box>
              <PyatchSpriteArea />
            </Box>
          </Grid>
        </Grid>
        <div id="testItem" style={{ zIndex: 2 }}>

        </div>
      </ThemeProvider>
    </PyatchProvider>
  );
}

export default App;