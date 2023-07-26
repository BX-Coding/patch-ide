import React, { useContext } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import CancelIcon from '@mui/icons-material/Cancel';
import sounds from '../assets/sounds.json';
import { Typography, Box } from '@mui/material';
import { PatchHorizontalButtons, PatchIconButton } from './PatchTemplates.jsx';

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
    const { showInternalSoundChooser, setShowInternalSoundChooser, handleAddSoundToActiveTarget } = useContext(pyatchContext);

    const onClickFunc = (sound) => {
        handleAddSoundToActiveTarget(sound, true).then(() => { setShowInternalSoundChooser(false); });
    }

    return (
        <Box className="soundSelectorHolder" sx={{ display: showInternalSoundChooser ? "block" : "none", backgroundColor: 'panel.dark' }}>
            <center>
                <PatchHorizontalButtons sx={{ justifyContent: "center", borderBottomWidth: "1px", borderBottomStyle: "solid", borderBottomColor: "divider" }}>
                    <Typography fontSize="18pt" marginBottom="8px">Choose a Sound</Typography>
                    <PatchIconButton color="error" variant="text" icon={<CancelIcon />} onClick={() => setShowInternalSoundChooser(false)} />
                </PatchHorizontalButtons>
                <Box sx={{ height: "4px" }} />
                {sounds.map((sound, i) => {
                    return <SoundItem key={i} onClickFunc={onClickFunc} sound={sound}></SoundItem>
                })}
            </center>
        </Box>
    );
}