import React, { useContext, useCallback } from 'react';
import patchContext from './provider/PatchContext.js';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { InternalSpriteChooser } from './InternalSpriteChooser.jsx';
import { InternalSoundChooser } from './InternalSoundChooser.jsx';

import { AddButton } from './PatchButtons.jsx';

export function AddSpriteButton(props) {
    const { onAddSprite, handleUploadCostume, setShowInternalChooser, setInternalChooserAdd, vmLoaded, patchReady } = useContext(patchContext);

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
            <AddButton onClick={handleButtonClick} />
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
            {(vmLoaded && patchReady) ? <InternalSpriteChooser/> : <></>}
            {vmLoaded ? <InternalSoundChooser/> : <></>}
        </Grid>
    );
}