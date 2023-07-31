import React, { useContext, useState, useEffect } from 'react';
import patchContext from '../provider/PatchContext.js';
import GlobalVariablesInspector from './VariableEditor/GlobalVariablesInspector.jsx';
import getCostumeUrl from '../../util/get-costume-url.js';

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DataObjectIcon from '@mui/icons-material/DataObject';
import FlutterDashIcon from '@mui/icons-material/FlutterDash';
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Box } from '@mui/material';
import CodeEditor from '../CodeEditor.jsx'
import AudioTrackIcon from '@mui/icons-material/Audiotrack'

import { AddButton, DeleteButton, HorizontalButtons, IconButton, ItemCard } from '../PatchButton/component.jsx';
import PublicIcon from '@mui/icons-material/Public.js';

import usePatchStore, { EditorTab } from '../../store';


export function EditorPane(props) {
    const { patchEditorTab } = useContext(patchContext);

    return <div className="tabContent" style={{
    }}>
        {[<CodeEditorWrapper key={0} />, <SpriteEditor key={1} />, <SoundEditor key={2} />, <GlobalVariables key={3} />][patchEditorTab]}
    </div>
}






export function SoundEditor(props) {
    return (
        <Grid container>
            <Grid item xs={12}>
                <SoundInspector />
            </Grid>
        </Grid>
    );
}

function GlobalVariables(props) {
    return (
        <Grid container>
            <Grid item xs={12}>
                <GlobalVariablesInspector />
            </Grid>
        </Grid>
    );
}



function AddSoundButton(props) {
    const { reloadSoundEditor } = props;
    const { handleUploadSound, showInternalSoundChooser, setShowInternalSoundChooser } = useContext(patchContext);
    const [anchorEl, setAnchorEl] = React.useState(null);
    const open = Boolean(anchorEl);

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget);
    };

    const handleClose = (event) => {
        setAnchorEl(null);
    };

    const handleBuiltIn = () => {
        handleClose();
        setShowInternalSoundChooser(true);
    }

    useEffect(() => {
        if (!showInternalSoundChooser) {
            reloadSoundEditor();
        }
    }, [showInternalSoundChooser])

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
            <MenuItem id="upload" onClick={() => { handleUploadSound().then((result) => { reloadSoundEditor(); }); handleClose(); }}>From Upload</MenuItem>
        </Menu >
    </>
}

function SoundDetails(props) {
    const { width, height } = props;

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

function SoundInspector(props) {
    const { pyatchVM, editingTargetId, soundsUpdate } = useContext(patchContext);
    const [selectedTarget, setSelectedTarget] = useState(pyatchVM.editingTarget);
    const [targetSounds, setTargetSounds] = useState(selectedTarget.getSounds());

    const [soundIndex, setSoundIndex] = useState(Math.min(targetSounds.length - 1, 0));

    const handleClick = (index, soundName) => () => {
        // Copy name to clipboard
        setSoundIndex(index);
    }

    useEffect(() => {
        setSelectedTarget(pyatchVM.editingTarget);
        setSoundIndex(0);
        setTargetSounds(pyatchVM.editingTarget.getSounds());
    }, [editingTargetId, pyatchVM]);

    const handleDeleteClick = (i) => {
        selectedTarget.deleteSound(i);

        let newSounds = selectedTarget.getSounds();

        setSoundIndex((i - 1 >= 0) ? (i - 1) : (0));
        setTargetSounds([...newSounds]);
    }

    // -------- Audio Playing --------

    //https://stackoverflow.com/questions/24151121/how-to-play-wav-audio-byte-array-via-javascript-html5
    window.onload = initAudioContext;
    var context;    // Audio context
    var buf;        // Audio buffer

    function initAudioContext() {
        if (!window.AudioContext) {
            if (!window.webkitAudioContext) {
                alert("Your browser does not support any AudioContext and cannot play back this audio.");
                return;
            }
            window.AudioContext = window.webkitAudioContext;
        }

        context = new AudioContext();
    }

    function playByteArray(byteArray) {
        if (!context) {
            initAudioContext();
        }

        var arrayBuffer = new ArrayBuffer(byteArray.length);
        var bufferView = new Uint8Array(arrayBuffer);
        for (let i = 0; i < byteArray.length; i++) {
            bufferView[i] = byteArray[i];
        }

        context.decodeAudioData(arrayBuffer, function (buffer) {
            buf = buffer;
            play();
        });
    }

    // Play the loaded file
    function play() {
        // Create a source node from the buffer
        var source = context.createBufferSource();
        source.buffer = buf;
        // Connect to the final output node (the speakers)
        source.connect(context.destination);
        // Play immediately
        source.start(0);
    }

    const handlePlayClick = (i) => {
        playByteArray(targetSounds[i].asset.data);
    }

    // TODO: add a sound picker to choose from internal sounds, similar to how you can
    // choose from uploading a sprite or using an existing one when adding a new sprite/costume

    // -------- Action Buttons --------
    const handleDeleteCurrentClick = () => handleDeleteClick(soundIndex);

    const reloadSoundEditor = () => {
        const newSounds = pyatchVM.editingTarget.getSounds();
        setSoundIndex((newSounds.length > 0) ? newSounds.length - 1 : 0);
        setTargetSounds([...newSounds]);
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
                    <IconButton icon={<PlayArrowIcon />} disabled={targetSounds[soundIndex].rate === 22050} onClick={() => { handlePlayClick(soundIndex); }} />
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
                        {targetSounds.map((sound, i) =>
                            <Grid item key={i}>
                                <ItemCard
                                    // TODO: change this (and the icon in PatchSoundDetails) to a MUI icon
                                    imageSrc={"https://cdn-icons-png.flaticon.com/512/3601/3601680.png"}
                                    title={sound.name}
                                    selected={i === soundIndex}
                                    onClick={handleClick(i, sound.name)}
                                    key={sound.name}
                                    width={120}
                                    height={120}
                                />
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
}

export function EditorTabButton(tab: EditorTab) {
    const editorTab = usePatchStore((state) => state.editorTab)
    const setEditorTab = usePatchStore((state) => state.setEditorTab)

    const updateEditorTab = () => {
        setEditorTab(tab);
    }

    const variant = editorTab === tab ? "contained" : "outlined";

    return <Button variant={variant} onClick={updateEditorTab}></Button>
}