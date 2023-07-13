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
import { PatchInternalSoundChooser } from './PatchInternalSoundChooser.jsx';

export function PyatchAddSprite(props) {
    const { onAddSprite, handleUploadCostume, setShowInternalChooser, setInternalChooserAdd } = useContext(pyatchContext);

    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const menuOpen = Boolean(menuAnchorEl);

    const handleButtonClick = (event) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = (event) => {
        setMenuAnchorEl(null);
    };

    const handleUploadNew = async (event) => {
        var newId = await onAddSprite();
        handleUploadCostume(newId);
    };

    const handleExistingClick = (event) => {
        setInternalChooserAdd(true);
        setShowInternalChooser(true);
        handleMenuClose();
    };

    return (
        <Grid container justifyContent="center">
            <Button variant="contained" onClick={handleButtonClick} sx={{ m: "1vh" }}>Add Sprite</Button>
            <Menu
                open={menuOpen}
                anchorEl={menuAnchorEl}
                onClose={handleMenuClose}
                PaperProps={{
                    style: {
                        maxHeight: '20ch',
                    }
                }}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem key="existing" onClick={handleExistingClick}>Use existing costume</MenuItem>
                <MenuItem key="new" onClick={handleUploadNew}>Upload new costume</MenuItem>
            </Menu>
            <PatchInternalSpriteChooser/>
            <PatchInternalSoundChooser/>
        </Grid>
    );
}