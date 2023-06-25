import React, { useContext } from 'react';
import ReactDOM, { unmountComponentAtNode } from 'react-dom';
import Button from '@mui/material/Button';
import pyatchContext from './provider/PyatchContext.js';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import backdrops from '../assets/backdrops.json';
import sprites from '../assets/sprites.json';
import { PatchInternalSpriteChooser } from './PatchInternalSpriteChooser.jsx';

export function PyatchAddSprite(props) {
    const { onAddSprite, handleUploadCostume, onBackgroundChange, pyatchVM, setShowInternalChooser, setInternalChooserAdd, internalChooserUpdate, setInternalChooserUpdate } = useContext(pyatchContext);
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
    const handleUploadNew = async (event) => {
        var newId = await onAddSprite();
        handleUploadCostume('target' + newId);
    };
    const handleSetCostumeEditor = (event) => {

    };

    const [anchorEl3, setAnchorEl3] = React.useState(null);
    const open3 = Boolean(anchorEl3);
    const handleClick3 = (event) => {
        setShowInternalChooser(true);
        setInternalChooserAdd(true);
        setInternalChooserUpdate(!internalChooserUpdate);
        handleClose2();
    };
    const handleClose3 = (event) => {
        
    };

    return (
        <Grid container justifyContent="center">
            <Button variant="contained" onClick={handleClick2} sx={{ m: "1vh" }}>Add Sprite</Button>
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
                <MenuItem key="existing" onClick={handleClick3}>Use existing costume</MenuItem>
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
                    return <MenuItem key={i} onClick={() => onBackgroundChange(i)}>{costume.name}</MenuItem>
                })}

            </Menu>
            <PatchInternalSpriteChooser pyatchVM={pyatchVM}/>
        </Grid>
    );
}