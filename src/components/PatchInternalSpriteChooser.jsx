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
    const { sprite, keyThing, pyatchVM, onClickFunc } = props;

    //const imageSrc = "";
    const selected = false;
    const actionButtons = "";

    const [imageSrc, setImageSrc] = useState("");

    //const { pyatchVM } = useContext(pyatchContext);
    // function (md5ext, costume, runtime, optVersion)
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
    const {pyatchVM, showInternalChooser, setShowInternalChooser, internalChooserAdd, onAddSprite, handleAddCostumesToActiveTarget, internalChooserUpdate, setInternalChooserUpdate } = useContext(pyatchContext);

    const onClickFunc = (sprite) => {
        if (internalChooserAdd) {
            onAddSprite(sprite);
        } else {
            handleAddCostumesToActiveTarget(sprite.costumes, true);
        }

        setShowInternalChooser(false);
        setInternalChooserUpdate(!internalChooserUpdate);
    }

    let [spriteItems, setSpriteItems] = useState(<div class="costumeSelectorHolder" style={{ display: showInternalChooser ? "block" : "none" }}></div>);

    useEffect(() => {
        setSpriteItems(<div class="costumeSelectorHolder" style={{ display: showInternalChooser ? "block" : "none" }}>
            <center>
                <Typography width="100%" fontSize="18pt" marginBottom="8px">Choose a Costume</Typography>
            </center>
            {sprites.map((sprite, i) => {
                if (pyatchVM != null) {
                    return <SpriteItem keyThing={i} onClickFunc={onClickFunc} sprite={sprite} pyatchVM={pyatchVM}></SpriteItem>
                } else {
                    return <></>
                }
            })}
        </div>);
    }, [internalChooserUpdate]);

    return (
        <>
        { spriteItems }
        </>
    );
}