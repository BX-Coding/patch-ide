import React from 'react';
import SpritePane from '../SpritePane';
import { Grid } from '@mui/material';
import './style.css'
import { TopBar } from '../TopBar';
import { EditorPane, EditorTabButton } from '../EditorPane';
import { VerticalButtons } from '../PatchButton';
import { ThemeProvider } from '@emotion/react';

import darkTheme from '../../themes/dark';
import lightTheme from '../../themes/light';
import { GamePane } from '../GamePane';
import { EditorTab } from '../../store/patchEditorStore';

import DataObjectIcon from '@mui/icons-material/DataObject';
import TheaterComedyIcon from '@mui/icons-material/TheaterComedy';
import MusicNoteIcon from '@mui/icons-material/MusicNote';
import PublicIcon from '@mui/icons-material/Public';

import SplashScreen from '../SplashScreen/component';
import usePatchStore from '../../store';


import useThreadAutoSave from './useThreadAutoSave';
import useMonitorProjectChange from './useMonitorProjectChange';
import useInitializedVm from './useInitializedVm';
import { ModalSelector } from '../ModalSelector';

import { useProjectActions } from '../../hooks/useProjectActions';
import { useLocalStorage, useReadLocalStorage } from 'usehooks-ts'


const App = () => {
  const setProjectChanged = usePatchStore((state) => state.setProjectChanged)
  const targetIds = usePatchStore((state) => state.targetIds)
  const patchVM = usePatchStore((state) => state.patchVM)
  const saveTargetThreads = usePatchStore((state) => state.saveTargetThreads)
  const editorTab = usePatchStore((state) => state.editorTab)
  const setSaveProject = usePatchStore((state) => state.setSaveProject)

  const [mode, setMode] = React.useState(localStorage.getItem("theme") || "dark");
  const [projectId] = useLocalStorage("patchProjectId", "N3JXaHgGXm4IpOMqAAk4");
  const [ loadProject, _, saveProject ] = useProjectActions(projectId);
  const onVmInit = () => {
      loadProject();
      setSaveProject(saveProject);
  }
  useInitializedVm(onVmInit);

  useThreadAutoSave(patchVM, saveTargetThreads, editorTab);
  useMonitorProjectChange(setProjectChanged, [targetIds])
  

  return (
    <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
      <SplashScreen renderCondition={true}>
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
          backgroundColor: 'background.default',
          color: "text.primary",
        }}>
          <ModalSelector />
          <TopBar mode={mode} setMode={setMode} />
          <Grid item container direction="row" className="leftContainer">
              <Grid item className="assetHolder" sx={{
                padding: "8px",
                borderRightWidth: "1px",
                borderColor: 'divider',
              }}>
                <VerticalButtons>
                  <EditorTabButton tab={EditorTab.CODE} icon={<DataObjectIcon/>}/>
                  <EditorTabButton tab={EditorTab.COSTUMES} icon={<TheaterComedyIcon/>}/>
                  <EditorTabButton tab={EditorTab.SOUNDS} icon={<MusicNoteIcon/>}/>
                  <EditorTabButton tab={EditorTab.VARIABLES} icon={<PublicIcon/>}/>
                </VerticalButtons>
              </Grid>
              <Grid item xs>
                <EditorPane />
              </Grid>
            </Grid>
          <Grid item className="rightContainer">
            <GamePane />
            <SpritePane />
          </Grid>
        </Grid>
      </SplashScreen>
    </ThemeProvider>
  );
}

export default App;