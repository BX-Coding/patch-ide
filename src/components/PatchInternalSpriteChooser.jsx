import React, { useContext, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import pyatchContext from './provider/PyatchContext.js';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import sprites from '../assets/sprites.json';
import getCostumeUrl from '../util/get-costume-url.js';
import { Typography, Box } from '@mui/material';

export function SpriteItem(props) {
    const { sprite, onClickFunc, pyatchVM } = props;

    const selected = false;

    const [imageSrc, setImageSrc] = useState("");

    pyatchVM.loadCostumeWrap(sprite.costumes[0].md5ext, sprite.costumes[0], pyatchVM.runtime).then((result) => { setImageSrc(getCostumeUrl(result.asset)) });

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
                <img src={imageSrc} class="spriteChooserImage" />
            </Box>
        </Box>
    )
}

export function PatchInternalSpriteChooser(props) {
    const { showInternalChooser, setShowInternalChooser, internalChooserAdd, onAddSprite, handleAddCostumesToActiveTarget, pyatchVM } = useContext(pyatchContext);

    const onClickFunc = (sprite) => {
        if (internalChooserAdd) {
            onAddSprite(sprite);
        } else {
            handleAddCostumesToActiveTarget(sprite.costumes, true);
        }

        setShowInternalChooser(false);
    }

    // These hold the sprite items
    const [spriteItems, setSpriteItems] = useState([]);

    // Generate the default sprites to fill the picker (if not already done). Doing this when the sprite
    // picker first appears (instead of when patch first loads) reduces initial loading time for Patch
    useEffect(() => {
        if ((showInternalChooser == true) && (spriteItems.length == 0)) {
            setSpriteItems(sprites.map((sprite, i) => {
                return <SpriteItem key={i} onClickFunc={onClickFunc} sprite={sprite} pyatchVM={pyatchVM}/>
            }));
        }
    }, [showInternalChooser]);

    return (
        <div className="costumeSelectorHolder" style={{ display: showInternalChooser ? "block" : "none" }}>
            <center>
                <Typography width="100%" fontSize="18pt" marginBottom="8px">Choose a Costume</Typography>
            </center>
            {spriteItems}
        </div>
    );
}