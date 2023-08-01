import React, { useContext, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { AddButton } from '../PatchButton/component.jsx';
import usePatchStore, { ModalSelectorType } from '../../store/index.js';
import { handleUploadCostume } from '../EditorPane/SpriteEditor/handleUpload.js';
import { onAddSprite } from './onAddSpriteHandler.js';

export function AddSpriteButton() {
    const showModalSelector = usePatchStore((state) => state.showModalSelector);

    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const menuOpen = Boolean(menuAnchorEl);

    const handleButtonClick = (event: any) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const handleUploadNew = async () => {
        var newId = await onAddSprite();
        handleUploadCostume(newId);
    };

    const handleExistingClick = () => {
        showModalSelector(ModalSelectorType.SPRITE);
        handleMenuClose();
    }

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
        </Grid>
    );
}