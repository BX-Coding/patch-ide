import React, { useContext, useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import pyatchContext from './provider/PyatchContext.js';
import AddIcon from '@mui/icons-material/Add';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import sounds from '../assets/sounds.json';
import getCostumeUrl from '../util/get-costume-url.js';
import { Typography, Box } from '@mui/material';

export function SoundItem(props) {
    const { sound, onClickFunc } = props;

    const selected = false;

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
            height: "40px",
            width: "84px",
            display: "inline-block",
            marginRight: "4px",
            cursor: "pointer"
        }}
            onClick={() => { onClickFunc(sound) }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
            }}>
                <Typography>{sound.name}</Typography>
            </Box>
        </Box>
    )
}

export function PatchInternalSoundChooser(props) {
    const {showInternalSoundChooser, setShowInternalSoundChooser, handleAddSoundToActiveTarget } = useContext(pyatchContext);

    const onClickFunc = (sound) => {
        handleAddSoundToActiveTarget(sound, true).then(() => { setShowInternalSoundChooser(false); });
    }

    return (
        <div class="soundSelectorHolder" style={{ display: showInternalSoundChooser ? "block" : "none" }}>
            <center>
                <Typography width="100%" fontSize="18pt" marginBottom="8px">Choose a Sound</Typography>
            </center>
            {sounds.map((sound, i) => {
                return <SoundItem onClickFunc={onClickFunc} sound={sound}></SoundItem>
            })}
        </div>
    );
}