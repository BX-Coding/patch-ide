import React, { useContext, useState } from 'react';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import patchContext from './provider/PatchContext.js';
import GitHubIcon from '@mui/icons-material/GitHub';

import { HorizontalButtons, TextButton, IconButton } from './PatchButton/component.jsx';
import { DarkMode } from '@mui/icons-material';

export default function TopBar(props) {
  const { mode, setMode } = props;

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
          <PatchFileName />
        </Grid>
      </Grid>
      <Grid container item xs={4} justifyContent="flex-end">
        <Grid item>
          <HorizontalButtons>
            <PatchProjectButton />
            <PatchSignOutButton />
            <PatchThemeButton mode={mode} setMode={setMode} />
          </HorizontalButtons>
        </Grid>
      </Grid>
    </Grid>
  );
}

export function PatchThemeButton(props) {
  const { mode, setMode } = props;

    return (
      <IconButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} variant="contained" icon={<DarkMode htmlColor={mode === "dark" ? "white" : "black"} />} onClick={() => {
        let newMode = (mode === "dark") ? "light" : "dark";
        setMode(newMode);
        localStorage.setItem("theme", newMode);
          }} />
    );
}

export function PatchSignOutButton() {
  const handleClick = (event) => {
    console.log(event.currentTarget.id);
  };

  return (
    <TextButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} text="Sign Out" id="signOut" variant="contained" onClick={handleClick} />
  );
}

export function PatchProjectButton() {
  const handleClick = (event) => {
    console.log(event.currentTarget.id);
  };

  return (
    <TextButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} id="project" variant="contained" onClick={handleClick} text="Projects" />
  );
}

export function PatchFileName() {

  const handleTextChange = event => {
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
  const { saveToLocalStorage, loadFromLocalStorage, downloadProject, loadSerializedProject, projectChanged, saveAllThreads } = useContext(patchContext);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
    setAnchorEl(null);
  };

  const handleSaveNow = async (event) => {
    await saveAllThreads();
    // idk if awaiting this is bad but it is unnecessary.
    saveToLocalStorage();
  };

  const handleLoadFromLocalStorage = (event) => {
    loadFromLocalStorage();
  }
  const handleNew = (event) => {
    /* For now, this will just clear the project from localStorage and reload. */
    localStorage.removeItem("proj");
    location.reload();
  }
  const handleDownload = async (event) => {
    await downloadProject();
  };

  const handleUpload = (event) => {
    //https://stackoverflow.com/questions/16215771/how-to-open-select-file-dialog-via-js
    var input = document.createElement('input');
    input.type = 'file';

    input.onchange = e => {

      // getting a hold of the file reference
      var file = e.target.files[0];

      // setting up the reader
      var reader = new FileReader();
      reader.readAsArrayBuffer(file);

      // here we tell the reader what to do when it's done reading...
      reader.onloadend = readerEvent => {
        var content = readerEvent.target.result; // this is the content!

        loadSerializedProject(content);
      }
    }

    input.click();
  }

  return (
    <HorizontalButtons>
      <IconButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} icon={<GitHubIcon />} onClick={() => {window.location.href = 'https://bx-coding.github.io/pyatch-react-ide/'}} variant="contained" />
      <TextButton
        id="file"
        variant="contained"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        text="File"
        sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }}
      />
      <TextButton sx={{ height: "40px", borderStyle: "solid", borderWidth: "1px", borderColor: "primary.light" }} id="saveNow" variant={projectChanged ? "contained" : "disabled"} onClick={handleSaveNow} text={projectChanged ? "Save" : "Saved"} />
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