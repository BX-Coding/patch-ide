import React, { useContext } from 'react';
import Button from '@mui/material/Button';
import pyatchContext from './provider/PyatchContext.js';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import backdrops from '../assets/backdrops.json';

export function PyatchAddSprite(props) {
    const { pyatchEditor, pyatchVM } = useContext(pyatchContext);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const costumes = backdrops[0].costumes;
    const open = Boolean(anchorEl);
    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = (event) => {
        setAnchorEl(null);
    };

    const [anchorEl2, setAnchorEl2] = React.useState(null);
    const open2 = Boolean(anchorEl2);
    const handleClick2 = (event) => {
        setAnchorEl2(event.currentTarget);
    };
    const handleClose2 = (event) => {
        setAnchorEl2(null);
    };
    const handleUploadNew = (event) => {
        pyatchEditor.handleUploadCostume();
    };
    const handleSetCostumeEditor = (event) => {

    };

    return (
        <Grid container justifyContent="center">
            <Button variant="contained" onClick={handleClick2} disabled={pyatchEditor.addSpriteDisabled} sx={{ m: "1vh" }}>Add Sprite</Button>
            <Menu
                open={open2}
                anchorEl={anchorEl2}
                onClose={handleClose2}
                PaperProps={{
                    style: {
                        maxHeight: '20ch',
                    }
                }}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem key="existing" onClick={() => { pyatchEditor.onAddSprite(); handleSetCostumeEditor(); }}>Use existing costume</MenuItem>
                <MenuItem key="new" onClick={handleUploadNew}>Upload new costume</MenuItem>
            </Menu>
            <Button
                variant="contained"
                aria-controls={open ? 'basic-menu' : undefined}
                aria-haspopup="true"
                aria-expanded={open ? 'true' : undefined}
                onClick={handleClick} sx={{ m: "1vh" }}>Change Background</Button>
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
                }}
            >
                {costumes.map((costume, i) => {
                    return <MenuItem key={i} onClick={() => pyatchEditor.onBackgroundChange(i)}>{costume.name}</MenuItem>
                })}

            </Menu>
        </Grid>
    );
}