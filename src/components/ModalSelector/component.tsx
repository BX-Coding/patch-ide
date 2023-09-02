import React, { useContext, useState, useEffect, useCallback } from 'react';
import CancelIcon from '@mui/icons-material/Cancel';
import { sprites } from '../../assets/sprites';
import { sounds }  from '../../assets/sounds';
import { backdrops } from '../../assets/backdrops';
import { Typography, Box, Grid } from '@mui/material';
import { HorizontalButtons, IconButton } from '../PatchButton';
import usePatchStore, { ModalSelectorType } from '../../store';
import { useAddSprite } from '../SpritePane/onAddSpriteHandler';
import { SoundJson, SpriteJson } from '../EditorPane/types';
import { useSoundHandlers } from '../../hooks/useSoundUploadHandlers';
import { ItemCard } from '../ItemCard';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import { useCostumeHandlers } from '../../hooks/useCostumeUploadHandlers';

export const ModalSelector = () => {
    const modalSelectorType = usePatchStore((state) => state.modalSelectorType);
    const modalSelectorOpen = usePatchStore((state) => state.modalSelectorOpen);
    const hideModalSelector = usePatchStore((state) => state.hideModalSelector);
    const { handleAddSoundToEditingTarget } = useSoundHandlers();
    const { handleAddCostumesToEditingTarget} = useCostumeHandlers();
    const { onAddSprite } = useAddSprite();



    const onClick = (asset: SpriteJson | SoundJson) => {
        if (modalSelectorType === ModalSelectorType.SPRITE) {
            const sprite = asset as SpriteJson;
            onAddSprite(sprite);
        } else if (modalSelectorType === ModalSelectorType.COSTUME || modalSelectorType === ModalSelectorType.BACKDROP) {
            const sprite = asset as SpriteJson;
            handleAddCostumesToEditingTarget(sprite.costumes, true);
        } else if (modalSelectorType === ModalSelectorType.SOUND) {
            const sound = asset as SoundJson;
            handleAddSoundToEditingTarget(sound, true);
        }
        hideModalSelector();
    }

    let internalAssets: SpriteJson[] | SoundJson[] = sprites;
    if (modalSelectorType === ModalSelectorType.COSTUME) {
        internalAssets = sprites.filter((sprite) => sprite.costumes.length > 1);
    } else if (modalSelectorType === ModalSelectorType.BACKDROP) {
        internalAssets = backdrops;
    } else if (modalSelectorType === ModalSelectorType.SOUND) {
        internalAssets = sounds;
    }

    return (
        <Box className="costumeSelectorHolder" sx={{ display: modalSelectorOpen ? "block" : "none", backgroundColor: 'panel.dark' }}>
            <center>
                <HorizontalButtons sx={{ justifyContent: "center", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "divider" }}>
                    <Typography fontSize="18pt" marginBottom="8px">Choose a {modalSelectorType}</Typography>
                    <IconButton color="error" variant="text" icon={<CancelIcon />} onClick={() => hideModalSelector()} />
                </HorizontalButtons>
                <Box sx={{ height: "4px" }} />
                <Grid container justifyContent="center" spacing={0.5}>
                    {internalAssets.map((asset, i) =>
                        <Grid item key={i}> 
                            <ItemCard 
                            title={asset.name} 
                            selected={false}
                            onClick={() => onClick(asset)}
                            width={84}
                            height={84}>
                                {modalSelectorType === ModalSelectorType.SOUND ? <VolumeUpIcon /> : <AssetImage sprite={asset as SpriteJson}/>}
                            </ItemCard>
                        </Grid>
                    )}
                </Grid>
            </center>
        </Box>
    );
}

type AssetImageProps = {
    sprite: SpriteJson
}

const AssetImage = ({ sprite }: AssetImageProps) => {
    const patchVM = usePatchStore((state) => state.patchVM);
    // const costumeUrlPromise = patchVM.loadCostumeWrap(sprite.costumes[0].md5ext, sprite.costumes[0], patchVM.runtime);

    return <>
        <HourglassEmptyIcon />
    </>;
}
