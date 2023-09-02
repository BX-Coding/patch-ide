import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import GitHubIcon from '@mui/icons-material/GitHub';
import { DarkMode } from '@mui/icons-material';
import BiotechIcon from '@mui/icons-material/Biotech';


import { HorizontalButtons, TextButton, IconButton } from '../PatchButton';
import usePatchStore from '../../store';
import { usePatchSerialization } from '../../hooks/usePatchSerialization';
import { DropdownMenu } from '../DropdownMenu';
import { auth } from '../../lib/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import { SignInButton } from './SignInButton';
import { SignUpButton } from './SignUpButton';
import { SignOutButton } from './SignOutButton';
import { useProjectActions } from '../../hooks/useProjectActions';
import { useLocalStorage } from 'usehooks-ts';
import { ProjectButton } from './ProjectButton';
import { useUser } from '../../hooks/useUser';
import { UserRole } from '../../types/userMeta';
import { Avatar, Button, Tooltip } from '@mui/material';
import { FeatureWrapper } from '../FeatureWrapper';

type ThemeButtonProps = {
  mode: string,
  setMode: (mode: string) => void,
}

export function ThemeButton({ mode, setMode }: ThemeButtonProps) {

    return (
      <IconButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} variant="contained" icon={<DarkMode htmlColor={mode === "dark" ? "white" : "black"} />} onClick={() => {
        let newMode = (mode === "dark") ? "light" : "dark";
        setMode(newMode);
        localStorage.setItem("theme", newMode);
          }} />
    );
}

export function FileName() {
  const setProjectName = usePatchStore((state) => state.setProjectName);

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setProjectName(event.target.value);
  };

  return (
    <>
      <TextField
        hiddenLabel
        onChange={handleTextChange}
        id="fileName"
        defaultValue="Untitled"
        size="small"
        fullWidth
        sx={{ marginLeft: "-16px" }}
      />
    </>
  );
}

const SaveButton = () => {
  const saveAllThreads = usePatchStore((state) => state.saveAllThreads);
  const projectChanged = usePatchStore((state) => state.projectChanged);
  const setProjectChanged = usePatchStore((state) => state.setProjectChanged);
  const isNewProject = usePatchStore((state) => state.isNewProject);
  const projectName = usePatchStore((state) => state.projectName);

  const [user] = useAuthState(auth);
  const { downloadProject } = usePatchSerialization();
  const { saveProject } = useProjectActions();

  const handleSaveNow = async () => {
    await saveAllThreads();
    if (user) {
      saveProject(projectName);
    } else {
      await downloadProject();
    }
    setProjectChanged(false);
  };

  return (
    <TextButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} variant="contained" onClick={handleSaveNow} text={projectChanged ? "Save" : "Saved"} disabled={!projectChanged}/>
  );
}

type ProjectControlsProps = {
  cloudEnabled: boolean,
}

const ProjectControls = ({ cloudEnabled }: ProjectControlsProps) => {
  const saveAllThreads = usePatchStore((state) => state.saveAllThreads);
  const projectName = usePatchStore((state) => state.projectName);

  const { downloadProject, loadSerializedProject } = usePatchSerialization();
  const [_, setProjectId ] = useLocalStorage("patchProjectId", "new");
  const { saveProject } = useProjectActions();

  const handleSaveNow = async () => {
    await saveAllThreads();
    if (cloudEnabled) {
      saveProject(projectName);
    }
  };

  const handleSaveCopy = async () => {
    await saveAllThreads();
    if (cloudEnabled) {
      saveProject(projectName);
    }
  }

  const handleNew = () => {
    setProjectId("new");
    location.reload();
  }
  const handleDownload = async () => {
    await downloadProject();
  };

  const handleUpload = () => {
    //https://stackoverflow.com/questions/16215771/how-to-open-select-file-dialog-via-js
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = (e: Event) => {
      // getting a hold of the file reference
      const target = e.target as HTMLInputElement;
      if (!target?.files) return;
      var file = target?.files[0];

      // setting up the reader
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);

      // here we tell the reader what to do when it's done reading...
      reader.onloadend = (readerEvent: ProgressEvent<FileReader>) => {
        var content = readerEvent?.target?.result; // this is the content!
        if (!content) return;
        loadSerializedProject(content, false);
      }
    }

    input.click();
  }

  const authenticatedOptions = [
    { label: "New", onClick: handleNew},
    { label: "Save Now", onClick: handleSaveNow},
    { label: "Save As A Copy", onClick: handleSaveCopy},
    { label: "Load From Your Computer", onClick: handleUpload},
    { label: "Save To Your Computer", onClick: handleDownload},
  ]

  const unathenticatedOptions = [
    { label: "New", onClick: handleNew},
    { label: "Load From Your Computer", onClick: handleUpload},
    { label: "Save To Your Computer", onClick: handleDownload},
  ]


  return (
    <HorizontalButtons>
      <IconButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} icon={<GitHubIcon />} onClick={() => {window.location.href = 'https://github.com/BX-Coding/patch-ide'}} variant="contained" />
      <DropdownMenu 
        type="text"
        text="File"
        sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }}
        options={cloudEnabled ? authenticatedOptions : unathenticatedOptions}
      />
      <SaveButton/>
    </HorizontalButtons>
  );
}

type BetaInfoIconProps = {
  isBetaUser: boolean,
}

function BetaInfoIcon({ isBetaUser }: BetaInfoIconProps) {
  const PATCH_DISCORD_LINK = process.env.REACT_APP_PATCH_DISCORD_LINK || "";
  return (
    <Button sx={{
      backgroundColor: isBetaUser ? "success.main" : "error.main",
      borderRadius: "100px",  
      height: "40px",
      width: "40px",
      ":hover": {
        backgroundColor: isBetaUser ? "success.dark" : "error.dark",
      },
    }}
    onClick={() => {
      if (!isBetaUser) {
        window.open(PATCH_DISCORD_LINK, "_blank");
      }
    }}>
        <BiotechIcon sx={{
            color: "white",
          }}/>
    </Button>
  );
}

type TopBarProps = {
  mode: string,
  setMode: (mode: string) => void,
}

export function TopBar({ mode, setMode }: TopBarProps) {
  const {user, userMeta, loading, error} = useUser();

  const nonBetaTesterTip = "You are not currently a beta tester.";
  const fullBetaExplainer = nonBetaTesterTip + " Click here to join the Patch Discord and become a beta tester."

  const loggedIn = !!user;
  const isBetaUser = loggedIn && (userMeta?.role === UserRole.BETA_TESTER || userMeta?.role === UserRole.ADMIN);

  return (
    <Grid container item direction="row" sx={{
      width: "100vw",
      padding: "8px",
      maxHeight: "56px",
      backgroundColor: 'primary.dark',
    }}>
      <Grid container item direction="row" xs={8} spacing={2} className="patchTopBar">
        <Grid item>
          <ProjectControls cloudEnabled={isBetaUser} />
        </Grid>
        <Grid item xs={6}>
          <FileName />
        </Grid>
      </Grid>
      <Grid container item xs={4} justifyContent="flex-end">
        <Grid item>
          <HorizontalButtons>
            { loggedIn && <FeatureWrapper show={!isBetaUser} message={fullBetaExplainer}>
              <BetaInfoIcon isBetaUser={isBetaUser}/>
            </FeatureWrapper>}
            { loggedIn && <FeatureWrapper show={!isBetaUser} message={nonBetaTesterTip}>
              <ProjectButton disabled={!isBetaUser} />
            </FeatureWrapper>}
            {loggedIn && <SignOutButton />}
            {!loggedIn && <SignInButton />}
            {!loggedIn && <SignUpButton />}
          </HorizontalButtons>
        </Grid>
      </Grid>
    </Grid>
  );
}
