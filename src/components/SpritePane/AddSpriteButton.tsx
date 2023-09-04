import React from 'react';
import Grid from '@mui/material/Grid';

import usePatchStore, { ModalSelectorType } from '../../store';
import { DropdownMenu } from '../DropdownMenu';
import AddIcon from '@mui/icons-material/Add';
import { useUploadSprite } from './useSpriteUpload';
import { useAssetFileSelector } from '../../hooks/useAssetFileSelector';

export function AddSpriteButton() {
    const showModalSelector = usePatchStore((state) => state.showModalSelector);
    const uploadSprite = useUploadSprite();
    const openAssetFileSelector = useAssetFileSelector(['.png', '.svg', '.jpg', '.jpeg', '.bmp', '.gif']);


    const handleUpload = async () => {
        const selectedFile = await openAssetFileSelector();
        console.warn("Selected File", selectedFile);
        uploadSprite(selectedFile);
    };

    const handleBuiltIn = () => {
        showModalSelector(ModalSelectorType.SPRITE);
    }

    return (
        <Grid container justifyContent="center">
            <DropdownMenu type="icon" icon={<AddIcon />} options={[
                { label: 'From Built-In', onClick: handleBuiltIn },
                { label: 'From Upload', onClick: handleUpload },
            ]}/>
        </Grid>
    );
}