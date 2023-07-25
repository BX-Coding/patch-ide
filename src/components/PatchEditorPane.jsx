import React, { useContext, useState, useEffect } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import PatchVariables from './PatchVariables.jsx';
import getCostumeUrl from '../util/get-costume-url.js';

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DataObjectIcon from '@mui/icons-material/DataObject';
import FlutterDashIcon from '@mui/icons-material/FlutterDash';
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import { Box } from '@mui/material';
import PatchCodeEditor from './PatchCodeEditor.jsx'
import AudioTrackIcon from '@mui/icons-material/Audiotrack'

import { PatchAddButton, PatchDeleteButton, PatchHorizontalButtons, PatchIconButton, ItemCard } from './PatchTemplates.jsx';
import PublicIcon from '@mui/icons-material/Public.js';

export function PatchEditorPane(props) {
    const { patchEditorTab } = useContext(pyatchContext);

    return <div className="tabContent" style={{
    }}>
        {[<PatchCodeEditorWrapper key={0} />, <PatchSpriteEditor key={1} />, <PatchSoundEditor key={2} />, <PatchGlobalVariables key={3} />][patchEditorTab]}
    </div>
}

export function PatchCodeEditorWrapper(props) {
    return (
        <Grid container direction="column" className="assetHolder" sx={{
            backgroundColor: 'panel.default',
            borderColor: 'divider',
            minHeight: "calc(100% - 40px)",
            marginBottom: "0px",
            padding: "8px"
        }}>
            <PatchCodeEditor />
        </Grid>
    );
}

export function PatchCodeEditorTabButton(props) {
    const { patchEditorTab, setPatchEditorTab } = useContext(pyatchContext);

    const updateEditorTab = () => {
        setPatchEditorTab(0);
    }

    return (
        <Button variant={patchEditorTab === 0 ? "contained" : "outlined"} onClick={updateEditorTab}><DataObjectIcon /></Button>
    );
}

export function PatchSpriteTabButton(props) {
    const { patchEditorTab, setPatchEditorTab } = useContext(pyatchContext);

    const updateEditorTab = () => {
        setPatchEditorTab(1);
    }

    return (
        <Button variant={patchEditorTab === 1 ? "contained" : "outlined"} onClick={updateEditorTab}><FlutterDashIcon /></Button>
    );
}

export function PatchSoundTabButton(props) {
    const { patchEditorTab, setPatchEditorTab } = useContext(pyatchContext);

    const updateEditorTab = () => {
        setPatchEditorTab(2);
    }

    return (
        <Button variant={patchEditorTab === 2 ? "contained" : "outlined"} onClick={updateEditorTab}><AudioTrackIcon /></Button>
    );
}

export function PatchGlobalVariablesTabButton(props) {
    const { patchEditorTab, setPatchEditorTab } = useContext(pyatchContext);

    const updateEditorTab = () => {
        setPatchEditorTab(3);
    }

    return (
        <Button variant={patchEditorTab === 3 ? "contained" : "outlined"} onClick={updateEditorTab}><PublicIcon /></Button>
    );
}

export function PatchSpriteEditor(props) {
    return (
        <Grid container>
            <Grid item xs={12}>
                <PatchSpriteInspector />
            </Grid>
        </Grid>
    );
}

export function PatchSoundEditor(props) {
    return (
        <Grid container>
            <Grid item xs={12}>
                <PatchSoundInspector />
            </Grid>
        </Grid>
    );
}

function PatchGlobalVariables(props) {
    return (
        <Grid container>
            <Grid item xs={12}>
                <PatchVariables />
            </Grid>
        </Grid>
    );
}

function AddCostumeButton(props) {
    const { handleUploadCostume, setShowInternalChooser, setInternalChooserAdd } = useContext(pyatchContext);
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
        setInternalChooserAdd(false);
        setShowInternalChooser(true);
    }

    return <>
        <PatchAddButton
            variant='contained'
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
            <MenuItem id="upload" onClick={() => { handleUploadCostume(); handleClose(); }}>From Upload</MenuItem>
        </Menu>
    </>
}

function AddSoundButton(props) {
    const { reloadSoundEditor } = props;
    const { handleUploadSound, showInternalSoundChooser, setShowInternalSoundChooser } = useContext(pyatchContext);
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
        <PatchAddButton
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

function PatchSoundDetails(props) {
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

function PatchSoundInspector(props) {
    const { pyatchVM, editingTargetId, soundsUpdate } = useContext(pyatchContext);
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
                <PatchHorizontalButtons sx={{
                    marginLeft: "4px",
                    marginTop: "4px"
                }}>
                    <AddSoundButton reloadSoundEditor={reloadSoundEditor} />
                    <PatchDeleteButton red={true} variant={"contained"} onClick={handleDeleteCurrentClick} onClickArgs={[]} />
                    <PatchIconButton icon={<PlayArrowIcon />} disabled={targetSounds[soundIndex].rate === 22050} onClick={() => { handlePlayClick(soundIndex); }} />
                </PatchHorizontalButtons>
            </Grid>
            <Grid item xs>
                <PatchSoundDetails width={"100%"} height={"calc(100vh - 460px)"} />
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

function PatchSpriteDetails(props) {
    const { costumeIndex, costumes, width, height } = props;

    return (
        <Grid container direction="row" spacing={2} sx={{
            width: width,
            height: height,
        }}>
            <Grid item xs={12} sx={{
                maxWidth: width,
                maxHeight: height
            }}>
                <img src={getCostumeUrl(costumes[costumeIndex].asset)} width={"100%"} height={"100%"} />
            </Grid>
        </Grid>
    );
}

function PatchSpriteInspector(props) {
    const { pyatchVM, editingTargetId, currentCostumes, setCurrentCostumes, currentCostumeIndex, setCurrentCostumeIndex } = useContext(pyatchContext);

    const handleClick = (costumeName) => {
        const newCostumeIndex = pyatchVM.editingTarget.getCostumeIndexByName(costumeName);
        pyatchVM.editingTarget.setCostume(newCostumeIndex);
        setCurrentCostumeIndex(newCostumeIndex);
    }

    const handleDeleteClick = (costumeName) => {
        const newCostumeIndex = pyatchVM.editingTarget.getCostumeIndexByName(costumeName);
        pyatchVM.editingTarget.deleteCostume(newCostumeIndex);
        setCurrentCostumeIndex(pyatchVM.editingTarget.currentCostume);
        setCurrentCostumes([...pyatchVM.editingTarget.getCostumes()]);
    }

    const handleDeleteCurrentClick = () => {
        handleDeleteClick(currentCostumes[currentCostumeIndex].name);
    }

    const deleteCurrentCostumeButton = () => <PatchDeleteButton red={true} variant={"contained"} onClick={handleDeleteCurrentClick} onClickArgs={[]} />

    return (
        <Grid container direction="column" className="assetHolder" sx={{
            backgroundColor: 'panel.default',
            minHeight: "calc(100% + 40px)",
            marginBottom: "0px"
        }}>
            <Grid item xs>
                <PatchHorizontalButtons sx={{
                    marginLeft: "4px",
                    marginTop: "4px"
                }}>
                    <Grid item><AddCostumeButton /></Grid>
                    <Grid item>{deleteCurrentCostumeButton()}</Grid>
                </PatchHorizontalButtons>
            </Grid>
            <Grid item xs>
                <PatchSpriteDetails width={"100%"} height={"calc(100vh - 460px)"} costumeIndex={currentCostumeIndex} costumes={currentCostumes} />
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
                        {currentCostumes.map((costume, i) =>
                            <Grid item key={i}>
                                <ItemCard
                                    imageSrc={getCostumeUrl(costume.asset)}
                                    title={costume.name}
                                    selected={i === currentCostumeIndex}
                                    onClick={handleClick}
                                    key={costume.name}
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