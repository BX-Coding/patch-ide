import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import GitHubIcon from '@mui/icons-material/GitHub';

import { HorizontalButtons, TextButton, IconButton } from '../PatchButton';
import { DarkMode } from '@mui/icons-material';
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

type TopBarProps = {
  mode: string,
  setMode: (mode: string) => void,
}

export function TopBar({ mode, setMode }: TopBarProps) {
  const [user, loading, error] = useAuthState(auth);

  return (
    <Grid container item direction="row" sx={{
      width: "100vw",
      padding: "8px",
      maxHeight: "56px",
      backgroundColor: 'primary.dark',
    }}>
      <Grid container item direction="row" xs={8} spacing={2} className="patchTopBar">
        <Grid item>
          <ProjectControls />
        </Grid>
        <Grid item xs={6}>
          <FileName />
        </Grid>
      </Grid>
      <Grid container item xs={4} justifyContent="flex-end">
        <Grid item>
          <HorizontalButtons>
            {user && <ProjectButton />}
            {user && <SignOutButton />}
            {!user && <SignInButton />}
            {!user && <SignUpButton />}
          </HorizontalButtons>
        </Grid>
      </Grid>
    </Grid>
  );
}

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

const ProjectControls = () => {
  const saveAllThreads = usePatchStore((state) => state.saveAllThreads);
  const isNewProject = usePatchStore((state) => state.isNewProject);
  const projectName = usePatchStore((state) => state.projectName);

  const { downloadProject, loadSerializedProject } = usePatchSerialization();
  const [_, setProjectId ] = useLocalStorage("patchProjectId", "new");
  const [user] = useAuthState(auth);
  const { saveProject } = useProjectActions();

  const handleSaveNow = async () => {
    await saveAllThreads();
    if (user) {
      saveProject(projectName);
    }
  };

  const handleSaveCopy = async () => {
    await saveAllThreads();
    if (user) {
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
      <IconButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} icon={<GitHubIcon />} onClick={() => {window.location.href = 'https://bx-coding.github.io/pyatch-react-ide/'}} variant="contained" />
      <DropdownMenu 
        type="text"
        text="File"
        sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }}
        options={user ? authenticatedOptions : unathenticatedOptions}
      />
      <SaveButton/>
    </HorizontalButtons>
  );
}
