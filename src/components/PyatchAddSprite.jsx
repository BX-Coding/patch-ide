import React, { useContext, useCallback } from 'react';
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

import { PatchAddButton } from './PatchTemplates.jsx';

export function PyatchAddSprite(props) {
    const { onAddSprite, handleUploadCostume, setShowInternalChooser, setInternalChooserAdd, vmLoaded, patchReady } = useContext(pyatchContext);

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

    const handleExistingClick = useCallback((event) => {
        setInternalChooserAdd(true);
        setShowInternalChooser(true);
        handleMenuClose();
    }, [setInternalChooserAdd, setShowInternalChooser]);

    return (
        <Grid container justifyContent="center">
            <PatchAddButton onClick={handleButtonClick} />
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
            {(vmLoaded && patchReady) ? <PatchInternalSpriteChooser/> : <></>}
            {vmLoaded ? <PatchInternalSoundChooser/> : <></>}
        </Grid>
    );
}