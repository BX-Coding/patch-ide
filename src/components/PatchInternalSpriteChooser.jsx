import React, { useContext, useState, useEffect, useCallback } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import CancelIcon from '@mui/icons-material/Cancel';
import sprites from '../assets/sprites.json';
import getCostumeUrl from '../util/get-costume-url.js';
import { Typography, Box } from '@mui/material';
import { PatchHorizontalButtons, PatchIconButton } from './PatchTemplates.jsx';

export function SpriteItem(props) {
    const { sprite, onClickFunc, pyatchVM } = props;

    const selected = false;

    const [imageSrc, setImageSrc] = useState("");

    const getCostumeWrap = useCallback(async () => {
        const costumeWrap = await pyatchVM.loadCostumeWrap(sprite.costumes[0].md5ext, sprite.costumes[0], pyatchVM.runtime);

        setImageSrc(getCostumeUrl(costumeWrap.asset));
    }, [pyatchVM, sprite]);

    useEffect(() => {
        getCostumeWrap();
    }, [getCostumeWrap]);

    return (
        <Box sx={{
            backgroundColor: selected ? 'primary.dark' : 'none',
            borderColor: 'primary.dark',
            borderStyle: 'solid',
            borderWidth: 3,
            borderRadius: 1,
            marginBottom: "4px",
            '&:hover': {
                backgroundColor: 'primary.main',
                opacity: [0.9, 0.8, 0.7],
            },
            height: "84px",
            width: "84px",
            display: "inline-block",
            marginRight: "4px",
            cursor: "pointer"
        }}
            onClick={() => { onClickFunc(sprite) }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                <img src={imageSrc} className="spriteChooserImage" />
            </Box>
        </Box>
    )
}

export function PatchInternalSpriteChooser(props) {
    const { showInternalChooser, setShowInternalChooser, internalChooserAdd, onAddSprite, handleAddCostumesToActiveTarget, pyatchVM } = useContext(pyatchContext);

    const onClickFunc = useCallback((sprite) => {
        if (internalChooserAdd) {
            onAddSprite(sprite);
        } else {
            handleAddCostumesToActiveTarget(sprite.costumes, true);
        }

        setShowInternalChooser(false);
    }, [internalChooserAdd, onAddSprite, handleAddCostumesToActiveTarget, setShowInternalChooser]);

    return (
        <Box className="costumeSelectorHolder" sx={{ display: showInternalChooser ? "block" : "none", backgroundColor: 'panel.dark' }}>
            <center>
                <PatchHorizontalButtons sx={{justifyContent: "center"}}>
                    <Typography fontSize="18pt" marginBottom="8px">Choose a Costume</Typography>
                    <PatchIconButton color="error" variant="text" icon={<CancelIcon />} onClick={() => setShowInternalChooser(false)} />
                </PatchHorizontalButtons>
                {sprites.map((sprite, i) => {
                    return <SpriteItem key={i} onClickFunc={onClickFunc} sprite={sprite} pyatchVM={pyatchVM} />
                })}
            </center>
        </Box>
    );
}