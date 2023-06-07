import * as React from 'react';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Grid from '@mui/material/Grid';
import * as PyatchProvider from './provider/PyatchProvider.jsx';
import pyatchContext from './provider/PyatchContext.js';

export default function PatchTopBar(){
    return(
        <>
        <Grid container item direction = "row" xs = {8} spacing={2}>
          <Grid item>
            <PatchFileButton/>
          </Grid>
          <Grid item xs={6}>
            <PatchFileName/>
          </Grid>
        </Grid>
        <Grid container item direction = "row" xs = {4} spacing={2} justifyContent = "flex-end">
          <Grid item>
            <PatchProjectButton/>
          </Grid>
          <Grid item>
            <PatchSignOutButton/>
          </Grid>
        </Grid>
        </>
    );
}

export function PatchSignOutButton() {
    const handleClick = (event) => {
      console.log(event.currentTarget.id);
    };
  
    return (
        <Button id="signOut" variant="contained" onClick={handleClick}>Sign Out</Button>
    );
}

export function PatchProjectButton() {
    const handleClick = (event) => {
        console.log(event.currentTarget.id);
    };
    
    return (
        <Button id = "project" variant="contained" onClick={handleClick}>Projects</Button>
    );
}

export function PatchFileName() {

    const handleTextChange = event =>{
        console.log(event.target.value);
    };

    return (
        <>
        <TextField
            hiddenLabel
            onChange = {handleTextChange}
            id="fileName"
            defaultValue="Untitled"
            variant="outlined"  
            size="small"
            fullWidth
            sx={{ input: { color: 'white'}, fieldset: { borderColor: "white" }}}
        />
        </>
    );
}

export function PatchFileButton() {
  const { pyatchEditor } = React.useContext(pyatchContext);
  
    const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    setAnchorEl(null);
    console.log(event.currentTarget.id);
  };
  const handleDownload = (event) => {
    pyatchEditor.downloadProject();
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
      reader.readAsText(file,'UTF-8');

      // here we tell the reader what to do when it's done reading...
      reader.onload = readerEvent => {
          var content = readerEvent.target.result; // this is the content!

          pyatchEditor.loadSerializedProject(content);
      }
    }

    input.click();
  }

  return (
    <>
      <Button
        id="file"
        variant="contained"
        aria-controls={open ? 'basic-menu' : undefined}
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
      >
        File
      </Button>
      <Menu
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        <MenuItem id="new" onClick={handleClose}>New</MenuItem>
        <MenuItem id="saveNow" onClick={handleClose}>Save Now</MenuItem>
        <MenuItem id="saveCopy" onClick={handleClose}>Save As A Copy</MenuItem>
        <MenuItem id="load" onClick={handleUpload}>Load From Your Computer</MenuItem>
        <MenuItem id="localSave" onClick={handleDownload}>Save To Your Computer</MenuItem>
      </Menu>
    </>
  );
  }