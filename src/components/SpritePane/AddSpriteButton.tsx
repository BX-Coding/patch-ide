import React, { useContext, useCallback } from 'react';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';

import { AddButton } from '../PatchButton';
import usePatchStore, { ModalSelectorType } from '../../store';
import { useAddSprite } from './onAddSpriteHandler';
import { useCostumeHandlers } from '../../hooks/useCostumeUploadHandlers';
import { DropdownMenu } from '../DropdownMenu';
import AddIcon from '@mui/icons-material/Add';

export function AddSpriteButton() {
    const showModalSelector = usePatchStore((state) => state.showModalSelector);
    const { handleUploadCostume } = useCostumeHandlers();
    const { onAddSprite, handleUploadedSprite } = useAddSprite();

    const handleUploadNew = async () => {
        var newId = await onAddSprite();
        handleUploadCostume(newId);
        handleUploadedSprite(newId);
    };

    const handleBuiltIn = () => {
        showModalSelector(ModalSelectorType.SPRITE);
    }

    return (
        <Grid container justifyContent="center">
            <DropdownMenu type="icon" icon={<AddIcon />} options={[
                { label: 'From Built-In', onClick: handleBuiltIn },
                { label: 'From Upload', onClick: handleUploadNew },
            ]}/>
        </Grid>
    );
}