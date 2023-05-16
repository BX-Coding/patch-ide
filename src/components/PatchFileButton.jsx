import * as React from 'react';
import Button from '@mui/material/Button';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

export default function PatchFileButton() {
  
    const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = (event) => {
    setAnchorEl(null);
    console.log(event.currentTarget.id);
  };

  return (
    <div>
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
        <MenuItem id="load" onClick={handleClose}>Load From Your Computer</MenuItem>
        <MenuItem id="localSave" onClick={handleClose}>Save To Your Computer</MenuItem>
      </Menu>
    </div>
  );
  }