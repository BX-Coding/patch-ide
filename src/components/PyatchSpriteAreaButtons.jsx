import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import pyatchContext from './provider/PyatchContext.js';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import backdrops from '../assets/backdrops.json';

function AddCostumeButton(props) {
  const { pyatchVM } = useContext(pyatchContext);
  const { targetId, setCostumeIndex } = props;
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
      setAnchorEl(event.currentTarget);
  };

  const handleClose = (event) => {
      setAnchorEl(null);
      console.log(event.currentTarget.id);
  };

  const handleNewCostume = (costume, fromCostumeLibrary, targetId) => {
      const costumes = Array.isArray(costume) ? costume : [costume];

      return Promise.all(costumes.map(c => {
          if (fromCostumeLibrary) {
              return pyatchVM.addCostumeFromLibrary(c.md5, c);
          }
          return pyatchVM.addCostume(c.md5, c, targetId);
      })).then(() => setCostumeIndex(0));
  }

  const handleUploadButtonClick = (event) => {
      //https://stackoverflow.com/questions/16215771/how-to-open-select-file-dialog-via-js
      var input = document.createElement('input');
      input.type = 'file';
      input.accept = 'image/png, image/jpeg image/svg+xml image/bmp image/gif';
  
      input.onchange = e => {
          handleFileUpload(e.target, (buffer, fileType, fileName, fileIndex, fileCount) => {
              costumeUpload(buffer, fileType, pyatchVM.runtime.storage, vmCostumes => {
                  vmCostumes.forEach((costume, i) => {
                      costume.name = `${fileName}${i ? i + 1 : ''}`;
                  });
                  handleNewCostume(vmCostumes, false, targetId);
              }, console.log);
          }, console.log);
      }
  
      input.click();
    }

  return <>
      <Button 
          id='addNewCostume'
          varient='contained' 
          color='primary'         
          aria-controls={open ? 'basic-menu' : undefined}
          aria-haspopup="true"
          aria-expanded={open ? 'true' : undefined}
          onClick={handleClick}>
          Add New Costume
      </Button>
      <Menu
      anchorEl={anchorEl}
      open={open}
      onClose={handleClose}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}
    >
      <MenuItem id="upload" onClick={handleUploadButtonClick}>From Upload</MenuItem>
    </Menu>
  </>
}

function AddSpriteButton(props) {
  const { pyatchEditor } = useContext(pyatchContext);

  return <Button variant="contained" onClick={() => pyatchEditor.onAddSprite()} disabled={pyatchEditor.addSpriteDisabled} sx={{m:"1vh"}}>Add Sprite</Button>;
}

function ChangeBackgroundButton(props) {
  const { pyatchEditor } = useContext(pyatchContext);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const costumes = backdrops[0].costumes;
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    setAnchorEl(null);
  };

  return <>
    <Button 
      variant="contained"
      aria-controls={open ? 'basic-menu' : undefined}
      aria-haspopup="true"
      aria-expanded={open ? 'true' : undefined}
      onClick={handleClick} sx={{m:"1vh"}}>Change Background</Button>
    <Menu
      open={open}
      anchorEl={anchorEl}
      onClose={handleClose}
      PaperProps={{
          style: {
              maxHeight: '20ch',
          }
      }}
      MenuListProps={{
        'aria-labelledby': 'basic-button',
      }}>
      {costumes.map((costume, i) => {
              return <MenuItem key = {i} onClick={() => pyatchEditor.onBackgroundChange(i)}>{costume.name}</MenuItem>
          })}

    </Menu>
  </>
}

export function SpriteAreaButtons(props) {

    return(
        <Grid container justifyContent="center">
            <AddSpriteButton/>
            <ChangeBackgroundButton/>
        </Grid>
    );
}