import { Box, Grid, Menu, MenuItem } from '@mui/material';
import React, { useContext, useEffect, useState } from 'react';
import { AddButton, DeleteButton, HorizontalButtons, IconButton } from '../../PatchButton';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import { ItemCard } from '../../ItemCard';
import usePatchStore, { ModalSelectorType } from '../../../store';
import { handleUploadSound } from './handleUpload';
import { useAudioPlayback } from './useAudioPlayback';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';
import { useEditingTarget } from '../../../hooks/useEditingTarget';
import { Target } from '../types';

export function SoundEditor() {
    return (
        <Grid container>
            <Grid item xs={12}>
                <SoundInspector />
            </Grid>
        </Grid>
    );
}

type AddSoundButtonProps = {
    reloadSoundEditor: () => void
}

function AddSoundButton({ reloadSoundEditor }: AddSoundButtonProps) {
    const showModalSelector = usePatchStore((state) => state.showModalSelector);

    const [editingTarget, setEditingTarget] = useEditingTarget() as [Target, (target: Target) => void];
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);


    const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleBuiltIn = () => {
        handleClose();
        showModalSelector(ModalSelectorType.SOUND);
    }

    return <>
        <AddButton
            id='addNewSound'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick} />
        <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleClose}
            MenuListProps={{
                'aria-labelledby': 'basic-button',
            }}
        >
            <MenuItem id="builtin" onClick={() => { handleBuiltIn(); }}>From Built-In</MenuItem>
            <MenuItem id="upload" onClick={() => { handleUploadSound(editingTarget.id).then((result) => { reloadSoundEditor(); }); handleClose(); }}>From Upload</MenuItem>
        </Menu >
    </>
}

type SoundDetailsProps = {
    width: string,
    height: string,
}

function SoundDetails({ width, height }: SoundDetailsProps) {

    return (
        <Grid container direction="row" spacing={2} sx={{
            width: width,
            height: height,
        }}>
            <Grid item xs={12} sx={{
                maxWidth: width,
                maxHeight: height
            }}>
                <img src={"https://cdn-icons-png.flaticon.com/512/3601/3601680.png"} width={"100%"} height={"100%"} />
            </Grid>
        </Grid>
    );
}

function SoundInspector() {
    const patchVM = usePatchStore((state) => state.patchVM);
    const selectedSoundIndex = usePatchStore((state) => state.selectedSoundIndex);
    const setSelectedSoundIndex = usePatchStore((state) => state.setSelectedSoundIndex);
    const sounds = usePatchStore((state) => state.sounds);
    const setSounds = usePatchStore((state) => state.setSounds);
    const playByteArray = useAudioPlayback();

    const [editingTarget, setEditingTarget] = useEditingTarget() as [Target, (target: Target) => void];

    const handleClick = (index: number, soundName: string) => () => {
        setSelectedSoundIndex(index);
    }

    useEffect(() => {
        setSelectedSoundIndex(0);
        setSounds(editingTarget.getSounds());
    }, [editingTarget, patchVM]);

    const handleDeleteClick = (index: number) => {
        editingTarget.deleteSound(index);
        let newSounds = editingTarget.getSounds();
        setSelectedSoundIndex(Math.max(0, index - 1));
        setSounds([...newSounds]);
    }

    const handlePlayClick = (index: number) => {
        const sound = sounds[index];
        if (sound?.asset?.data) {
            playByteArray(sound.asset.data);
        }
    }

    const handleDeleteCurrentClick = () => handleDeleteClick(selectedSoundIndex);

    const reloadSoundEditor = () => {
        const newSounds = patchVM.editingTarget.getSounds();
        setSounds([...newSounds]);
    }

    return (
        <Grid container direction="column" className="assetHolder" sx={{
            backgroundColor: 'panel.default',
            minHeight: "calc(100% + 40px)",
            marginBottom: "0px"
        }}>
            <Grid item xs>
                <HorizontalButtons sx={{
                    marginLeft: "4px",
                    marginTop: "4px"
                }}>
                    <AddSoundButton reloadSoundEditor={reloadSoundEditor} />
                    <DeleteButton red={true} variant={"contained"} onClick={handleDeleteCurrentClick} onClickArgs={[]} />
                    <IconButton icon={<PlayArrowIcon />} disabled={sounds[selectedSoundIndex].rate === 22050} onClick={() => { handlePlayClick(selectedSoundIndex); }} />
                </HorizontalButtons>
            </Grid>
            <Grid item xs>
                <SoundDetails width={"100%"} height={"calc(100vh - 460px)"} />
            </Grid>
            <Grid item xs sx={{
                borderTopWidth: "1px",
                borderTopStyle: "solid",
                borderTopColor: 'divider',
            }}>
                <Box sx={{ overflowY: "auto", height: "280px", position: 'relative', bottom: 0 }}>
                    <Grid container direction="row" spacing={1} sx={{
                        margin: "0px",
                        backgroundColor: 'panel.default',
                        padding: "4px",
                        width: "100%",
                        minHeight: "100%"
                    }}>
                        {sounds.map((sound, i) =>
                            <Grid item key={i}>
                                <ItemCard
                                    title={sound.name}
                                    selected={i === selectedSoundIndex}
                                    onClick={handleClick(i, sound.name)}
                                    key={sound.name}
                                    width={120}
                                    height={120}
                                ><VolumeUpIcon /></ItemCard>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
}
