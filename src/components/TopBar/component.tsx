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

type TopBarProps = {
  mode: string,
  setMode: (mode: string) => void,
}

export function TopBar({ mode, setMode }: TopBarProps) {

  return (
    <Grid container item direction="row" sx={{
      width: "100vw",
      padding: "8px",
      maxHeight: "56px",
      backgroundColor: 'primary.dark',
    }}>
      <Grid container item direction="row" xs={8} spacing={2} className="patchTopBar">
        <Grid item>
          <FileButton />
        </Grid>
        <Grid item xs={6}>
          <FileName />
        </Grid>
      </Grid>
      <Grid container item xs={4} justifyContent="flex-end">
        <Grid item>
          <HorizontalButtons>
            <ProjectButton />
            <SignOutButton />
            <ThemeButton mode={mode} setMode={setMode} />
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

export function SignOutButton() {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget.id);
  };

  return (
    <TextButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} text="Sign Out" variant="contained" onClick={handleClick} />
  );
}

export function ProjectButton() {
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    console.log(event.currentTarget.id);
  };

  return (
    <TextButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} variant="contained" onClick={handleClick} text="Projects" />
  );
}

export function FileName() {

  const handleTextChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log(event.target.value);
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

export function FileButton() {
  const projectChanged = usePatchStore((state) => state.projectChanged);
  const saveAllThreads = usePatchStore((state) => state.saveAllThreads);
  const { saveToLocalStorage, loadFromLocalStorage, downloadProject, loadSerializedProject } = usePatchSerialization();


  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleSaveNow = async () => {
    await saveAllThreads();
    saveToLocalStorage();
  };

  const handleLoadFromLocalStorage = () => {
    loadFromLocalStorage();
  }
  const handleNew = () => {
    /* For now, this will just clear the project from localStorage and reload. */
    localStorage.removeItem("proj");
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
        loadSerializedProject(content);
      }
    }

    input.click();
  }

  return (
    <HorizontalButtons>
      <IconButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} icon={<GitHubIcon />} onClick={() => {window.location.href = 'https://bx-coding.github.io/pyatch-react-ide/'}} variant="contained" />
      <TextButton
        variant="contained"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        text="File"
        sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }}
      />
      <TextButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} disabled={!projectChanged} variant={"contained"} onClick={handleSaveNow} text={projectChanged ? "Save" : "Saved"} />
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem id="new" onClick={handleNew}>New</MenuItem>
        <MenuItem id="saveNow" onClick={handleSaveNow}>Save Now</MenuItem>
        <MenuItem id="saveCopy" onClick={handleClose}>Save As A Copy</MenuItem>
        <MenuItem id="load" onClick={handleUpload}>Load From Your Computer</MenuItem>
        <MenuItem id="localSave" onClick={handleDownload}>Save To Your Computer</MenuItem>
      </Menu>
    </HorizontalButtons>
  );
}