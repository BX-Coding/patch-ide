import React, { useContext, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { InternalSpriteChooser } from '../InternalSpriteChooser.jsx';
import { InternalSoundChooser } from '../InternalSoundChooser.jsx';

import { AddButton } from '../PatchButton/component.jsx';
import usePatchStore, { ModalSelectorType } from '../../store/index.js';
import { handleUploadCostume } from '../EditorPane/SpriteEditor/handleCostume.js';
import { Sprite, SpriteJson, Target } from '../EditorPane/types.js';
import { sprites } from '../../assets/sprites';

export function AddSpriteButton() {
    const patchVM = usePatchStore((state) => state.patchVM);
    const setTargetIds = usePatchStore((state) => state.setTargetIds);
    const setEditingTargetId = usePatchStore((state) => state.setEditingTargetId);
    const showModalSelector = usePatchStore((state) => state.showModalSelector);
    const vmLoaded = usePatchStore((state) => state.vmLoaded);
    const patchReady = usePatchStore((state) => state.patchReady);
    const setEditingTargetAttributes = usePatchStore((state) => state.setEditingTargetAttributes);
    const saveTargetThreads = usePatchStore((state) => state.saveTargetThreads);

    const [menuAnchorEl, setMenuAnchorEl] = React.useState(null);
    const menuOpen = Boolean(menuAnchorEl);

    const handleButtonClick = (event: any) => {
        setMenuAnchorEl(event.currentTarget);
    };

    const handleMenuClose = () => {
        setMenuAnchorEl(null);
    };

    const changeSpriteValues = (eventSource: Target | null = null) => {
        if (!patchVM) {
          return;
        }
    
        // only update the attributes if the active sprite has changes
        if (eventSource) {
          if (eventSource.id !== patchVM.editingTarget?.id) {
            return;
          }
        }
    
        const editingTarget = patchVM.editingTarget;
    
        if (editingTarget) {
          setEditingTargetAttributes(editingTarget.x, editingTarget.y, editingTarget.size, editingTarget.direction)
        }
    
      }
    

    const addSprite = async (sprite: Sprite | SpriteJson) => {
        await patchVM.addSprite(sprite);
        const targets: Target[] = patchVM.getAllRenderedTargets();
        const newTarget = targets[targets.length - 1];
    
        setTargetIds(targets.map(target => target.id));
        patchVM.setEditingTarget(newTarget.id);
        setEditingTargetId(newTarget.id);
    
        newTarget.on('EVENT_TARGET_VISUAL_CHANGE', changeSpriteValues);
    }

    const onAddSprite = async (sprite?: Sprite) => {
        if (patchVM && patchVM.editingTarget) {
          saveTargetThreads(patchVM.editingTarget);
        }
        const validatedSprite = sprite ? sprite : sprites[0];
        await addSprite(validatedSprite);
        return patchVM.editingTarget.id;
    }

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
            {(vmLoaded && patchReady) ? <InternalSpriteChooser/> : <></>}
            {vmLoaded ? <InternalSoundChooser/> : <></>}
        </Grid>
    );
}