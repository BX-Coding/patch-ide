import React from "react";
import { useState, useEffect } from "react";
import SpritePane from "../SpritePane";
import { Button, Grid, Tooltip } from "@mui/material";
import "./style.css";
import { TopBar } from "../TopBar";
import { EditorPane, EditorTabButton } from "../EditorPane";
import { VerticalButtons } from "../PatchButton";
import { ThemeProvider } from "@emotion/react";

import darkTheme from "../../themes/dark";
import lightTheme from "../../themes/light";
import { GamePane } from "../GamePane";
import { EditorTab } from "../../store/patchEditorStore";

import DataObjectIcon from "@mui/icons-material/DataObject";
import TheaterComedyIcon from "@mui/icons-material/TheaterComedy";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import PublicIcon from "@mui/icons-material/Public";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import Typography from "@mui/material/Typography";

import SplashScreen from "../SplashScreen/component";
import usePatchStore from "../../store";

import useThreadAutoSave from "./useThreadAutoSave";
import useMonitorProjectChange from "./useMonitorProjectChange";
import useInitializedVm from "./useInitializedVm";
import { ModalSelector } from "../ModalSelector";

import { useProjectActions } from "../../hooks/useProjectActions";
import { useLocalStorage, useReadLocalStorage } from "usehooks-ts";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { LegalDialogueButton } from "./LegalDialogueButton";

import Popover from "@mui/material/Popover";

interface Parameter {
  name: string;
  type: string;
}

interface PatchFunction {
  name: string;
  parameters: Parameter[];
  description: string;
  exampleUsage: string;
  returnType: string;
}

const App = () => {
  const setProjectChanged = usePatchStore((state) => state.setProjectChanged);
  const targetIds = usePatchStore((state) => state.targetIds);
  const patchVM = usePatchStore((state) => state.patchVM);
  const saveTargetThreads = usePatchStore((state) => state.saveTargetThreads);
  const editorTab = usePatchStore((state) => state.editorTab);

  // Popover state
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );
  const [apiData, setApiData] = useState<PatchFunction[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch(`/patch-api.json`, { method: "GET" });
        if (res.ok) {
          const data = await res.json();
          setApiData(data["patch-functions"]);
        }
      } catch (e: any) {
        console.log(e);
      } finally {
      }
    };

    fetchData();
  }, []);

  const [mode, setMode] = React.useState(
    localStorage.getItem("theme") || "dark"
  );
  const [projectId] = useLocalStorage("patchProjectId", "new");
  const { loadProject } = useProjectActions(projectId);
  const onVmInit = () => {
    loadProject();
  };
  useInitializedVm(onVmInit);

  useThreadAutoSave(patchVM, saveTargetThreads, editorTab);
  useMonitorProjectChange(setProjectChanged, [targetIds]);

  const variant = "outlined";

  // Popover functions
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "simple-popover" : undefined;

  return (
    <ThemeProvider theme={mode === "dark" ? darkTheme : lightTheme}>
      <SplashScreen renderCondition={true}>
        <ToastContainer theme="dark" position="top-center" />
        <Grid
          container
          item
          direction="row"
          width={"100%"}
          sx={{
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
            backgroundColor: "background.default",
            color: "text.primary",
          }}
        >
          <ModalSelector />
          <TopBar mode={mode} setMode={setMode} />
          <Grid item container direction="row" className="leftContainer">
            <Grid
              item
              className="assetHolder"
              sx={{
                padding: "8px",
                borderRightWidth: "1px",
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <VerticalButtons>
                <EditorTabButton
                  tab={EditorTab.CODE}
                  icon={<DataObjectIcon />}
                />
                <EditorTabButton
                  tab={EditorTab.COSTUMES}
                  icon={<TheaterComedyIcon />}
                />
                <EditorTabButton
                  tab={EditorTab.SOUNDS}
                  icon={<MusicNoteIcon />}
                />
                <EditorTabButton
                  tab={EditorTab.VARIABLES}
                  icon={<PublicIcon />}
                />
                <Button
                  aria-describedby={id}
                  variant={variant}
                  onClick={handleClick}
                >
                  <ArticleOutlinedIcon />
                </Button>
                <Popover
                  id={id}
                  open={open}
                  anchorEl={anchorEl}
                  onClose={handleClose}
                  anchorOrigin={{
                    vertical: "bottom",
                    horizontal: "left",
                  }}
                >
                  <Typography sx={{ p: 2 }}>
                    {apiData.map((value, key) => (
                      <div key={key}>{value.name}</div>
                    ))}
                  </Typography>
                </Popover>
              </VerticalButtons>
              <LegalDialogueButton />
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
};

export default App;
