import React, { useContext, useState, useEffect, useCallback } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { sprites } from '../../assets/sprites';
import { sounds }  from '../../assets/sounds';
import { getCostumeUrl } from 'get-costume-url';
import { Typography, Box } from '@mui/material';
import { HorizontalButtons, IconButton } from '../PatchButton';
import usePatchStore, { ModalSelectorType } from '../../store';
import { handleAddCostumesToEditingTarget } from '../EditorPane/SpriteEditor/handleUpload.js';
import { onAddSprite } from '../SpritePane/onAddSpriteHandler.js';
import { SoundJson, SpriteJson } from '../EditorPane/types.js';
import { handleAddSoundToEditingTarget } from '../EditorPane/SoundEditor/handleUpload.js';
import { ItemCard } from '../ItemCard';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

export const ModalSelector = () => {
    const patchVM = usePatchStore((state) => state.patchVM);
    const modalSelectorType = usePatchStore((state) => state.modalSelectorType);
    const modalSelectorOpen = usePatchStore((state) => state.modalSelectorOpen);
    const hideModalSelector = usePatchStore((state) => state.hideModalSelector);



    const onClick = (asset: SpriteJson | SoundJson) => {
        if (modalSelectorType === ModalSelectorType.SPRITE) {
            const sprite = asset as SpriteJson;
            onAddSprite(sprite);
        } else if (modalSelectorType === ModalSelectorType.COSTUME) {
            const sprite = asset as SpriteJson;
            handleAddCostumesToEditingTarget(sprite.costumes, true);
        } else if (modalSelectorType === ModalSelectorType.SOUND) {
            const sound = asset as SoundJson;
            handleAddSoundToEditingTarget(sound, true);
        }
        hideModalSelector();
    }

    const getAssetNode = async (asset: SpriteJson | SoundJson) => {
        if (modalSelectorType === ModalSelectorType.SPRITE || modalSelectorType === ModalSelectorType.COSTUME) {
            const sprite = asset as SpriteJson;
            const costumeWrap = await patchVM.loadCostumeWrap(sprite.costumes[0].md5ext, sprite.costumes[0], patchVM.runtime);
            const url = await getCostumeUrl(costumeWrap.asset);
            return <img src={url} className="spriteChooserImage" />
        } else if (modalSelectorType === ModalSelectorType.SOUND) {
            return <VolumeUpIcon />
        }
    }

    const internalAssets = modalSelectorType === ModalSelectorType.SPRITE ? sprites : sounds;

    return (
        <Box className="costumeSelectorHolder" sx={{ display: modalSelectorOpen ? "block" : "none", backgroundColor: 'panel.dark' }}>
            <center>
                <HorizontalButtons sx={{ justifyContent: "center", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "divider" }}>
                    <Typography fontSize="18pt" marginBottom="8px">Choose a Costume</Typography>
                    <IconButton color="error" variant="text" icon={<CancelIcon />} onClick={() => hideModalSelector()} />
                </HorizontalButtons>
                <Box sx={{ height: "4px" }} />
                {internalAssets.map((asset, i) => {
                    return <ItemCard 
                        title={asset.name} 
                        selected={false}
                        onClick={() => onClick(asset)}
                        width={84}
                        height={84}>{getAssetNode(asset)}</ItemCard>
                })}
            </center>
        </Box>
    );
}