import React, { useContext, useState, useEffect } from 'react';
import pyatchContext from './provider/PyatchContext.js';
import PatchVariables from './PatchVariables.jsx';
import PatchErrorWindow from './PatchErrorWindow.jsx';
import getCostumeUrl from '../util/get-costume-url.js';
import { handleFileUpload, costumeUpload } from '../util/file-uploader.js'

import Button from '@mui/material/Button'
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import DataObjectIcon from '@mui/icons-material/DataObject';
import FlutterDashIcon from '@mui/icons-material/FlutterDash';
import DeleteIcon from '@mui/icons-material/Delete';
import PlayArrowIcon from '@mui/icons-material/PlayArrow'
import AddReactionIcon from '@mui/icons-material/AddReaction';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Typography, Box } from '@mui/material';
import PatchCodeEditor from './PatchCodeEditor.jsx'
import AudioTrackIcon from '@mui/icons-material/Audiotrack'

import { PatchAddButton, PatchDeleteButton, PatchHorizontalButtons, ItemCard } from './PatchTemplates.jsx';

export function PatchEditorPane(props) {
    const { patchEditorTab } = useContext(pyatchContext);

    return <div class="tabContent" style={{
        height: "calc(100% - 51px)"
    }}>
        {[<PatchCodeEditorWrapper />, <PatchSpriteEditor />, <PatchSoundEditor />][patchEditorTab]}
    </div>
}

export function PatchCodeEditorWrapper(props) {
    return (
        <Grid container direction="column" className="assetHolder" sx={{
            backgroundColor: 'panel.default',
            borderColor: 'divider',
            minHeight: "100%",
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

export function PatchSpriteEditor(props) {
    return (
        <PatchSpriteInspector />
    );
    /*return (
        <Grid container marginTop="8px">
            <Grid item xs={"auto"}>
                <PatchSpriteInspector />
            </Grid>
            <Grid item xs>
                <PatchSoundInspector />
            </Grid>
            <Grid item xs>
                <PatchGlobalVariables />
            </Grid>
        </Grid>
    );*/
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
    return <>
        <Grid><PatchVariables /></Grid>
    </>;
}

/*function AddCostumeButton(props) {
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
        <Button
            id='addNewCostume'
            variant='contained'
            color='primary'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}>
            Add New Costume
        </Button>
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
}*/

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
            onClick={handleClick}/>
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
        <Button
            id='addNewSound'
            varient='contained'
            color='primary'
            aria-controls={open ? 'basic-menu' : undefined}
            aria-haspopup="true"
            aria-expanded={open ? 'true' : undefined}
            onClick={handleClick}>
            Add New Sound
        </Button>
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

function PatchSoundInspector(props) {
    const { pyatchVM, editingTargetId, soundsUpdate } = useContext(pyatchContext);
    const [selectedTarget, setSelectedTarget] = useState(pyatchVM.editingTarget);
    const [targetSounds, setTargetSounds] = useState(selectedTarget.getSounds());

    const [soundIndex, setSoundIndex] = useState(Math.min(targetSounds.length - 1, 0));

    const handleClick = (index, soundName) => () => {
        // Copy name to clipboard
        // navigator.clipboard.writeText(soundName);
        setSoundIndex(index);
    }

    useEffect(() => {
        setSelectedTarget(pyatchVM.editingTarget);
        setSoundIndex(0);
        setTargetSounds(pyatchVM.editingTarget.getSounds());
    }, [editingTargetId]);

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
    
    const playButton = (i) => <Button sx={{ color: 'white', width: 20 }} disabled={targetSounds[i].rate === 22050} onClick={() => { handlePlayClick(i); }}><PlayArrowIcon /></Button>
    const copyButton = (soundName) => <Button sx={{ color: 'white', width: 20 }} onClick={() => { navigator.clipboard.writeText(soundName); }}><ContentCopyIcon /></Button>
    const deleteButton = (i) => <Button color='error' sx={{ width: 20 }} onClick={() => { handleDeleteClick(i); }}><DeleteIcon /></Button>

    const reloadSoundEditor = () => {
        const newSounds = pyatchVM.editingTarget.getSounds();
        setSoundIndex((newSounds.length > 0) ? newSounds.length - 1 : 0);
        setTargetSounds([...newSounds]);
    }

    return (
        <div class="assetHolder">
            <audio id="soundPreview" src="" type="" />
            {targetSounds.map((sound, i) =>
                <ItemCard
                    imageSrc={"https://cdn-icons-png.flaticon.com/512/3601/3601680.png"}
                    title={sound.name}
                    selected={i === soundIndex}
                    onClick={handleClick(i, sound.name)}
                    actionButtons={[copyButton(sound.name), deleteButton(i), playButton(i)]}
                    key={sound.name}
                    width={120}
                    height={120}
                />)}
            <AddSoundButton reloadSoundEditor={reloadSoundEditor} />
        </div>
    );
}

function PatchSpriteDetails(props) {
    const { costumeIndex, costumes, width, height } = props;
    const { pyatchVM } = useContext(pyatchContext);

    return (
        <Grid container direction="row" spacing={2} sx={{
            width: width,
            height: height,
        }}>
            <Grid item xs={12} sx={{
                maxWidth: width,
                maxHeight: height
            }}>
                <img src={getCostumeUrl(costumes[costumeIndex].asset)} width={"100%"} height={"100%"}/>
            </Grid>
        </Grid>
    );
}

function PatchSpriteInspector(props) {
    /*const { pyatchVM, editingTargetId, costumesUpdate, setCostumesUpdate } = useContext(pyatchContext);
    let selectedTarget = pyatchVM.editingTarget;
    let currentCostume = selectedTarget.getCurrentCostume();

    const [costumeIndex, setCostumeIndex] = useState(selectedTarget.getCostumeIndexByName(currentCostume.name));
    const [costumes, setCostumes] = useState(selectedTarget.getCostumes());

    const handleClick = (costumeName) => {
        const newCostumeIndex = selectedTarget.getCostumeIndexByName(costumeName);
        selectedTarget.setCostume(newCostumeIndex);
        setCostumeIndex(newCostumeIndex);
    }

    const handleDeleteClick = (costumeName) => {
        const newCostumeIndex = selectedTarget.getCostumeIndexByName(costumeName);
        selectedTarget.deleteCostume(newCostumeIndex);
        setCostumeIndex(selectedTarget.currentCostume);
        setCostumesUpdate(!costumesUpdate);
    }

    const handleDeleteCurrentClick = () => {
        handleDeleteClick(currentCostume.name);
    }

    //const deleteCostumeButton = (costumeName) => <Button color='error' onClick={() => handleDeleteClick(costumeName)}><DeleteIcon /></Button>
    const deleteCostumeButton = (costumeName) => <PatchDeleteButton red={true} onClick={handleDeleteClick} onClickArgs={[costumeName]} />

    const deleteCurrentCostumeButton = () => <PatchDeleteButton red={true} variant={"contained"} onClick={handleDeleteCurrentClick} onClickArgs={[]} />

    useEffect(() => {
        selectedTarget = pyatchVM.runtime.getTargetById(editingTargetId);
        currentCostume = selectedTarget.getCurrentCostume();
        setCostumeIndex(selectedTarget.getCostumeIndexByName(currentCostume.name));
        setCostumes([...selectedTarget.getCostumes()]);
        console.warn("updating costumes");
    }, [editingTargetId, costumesUpdate]);*/
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

    //const deleteCostumeButton = (costumeName) => <Button color='error' onClick={() => handleDeleteClick(costumeName)}><DeleteIcon /></Button>
    const deleteCostumeButton = (costumeName) => <PatchDeleteButton red={true} onClick={handleDeleteClick} onClickArgs={[costumeName]} />

    const deleteCurrentCostumeButton = () => <PatchDeleteButton red={true} variant={"contained"} onClick={handleDeleteCurrentClick} onClickArgs={[]} />

    return (
        <Grid container direction="column" className="assetHolder" sx={{
            backgroundColor: 'panel.default',
            borderColor: 'divider',
            borderTopRightRadius: "0px",
            borderBottomRightRadius: "0px",
            borderRightWidth: "1px",
            minHeight: "100%",
            marginBottom: "0px"
        }}>
            <Grid item xs>
            <PatchHorizontalButtons sx={{
                marginLeft: "4px",
                marginTop: "4px"
            }}>
                <Grid item>{deleteCurrentCostumeButton()}</Grid>
                <Grid item><AddCostumeButton /></Grid>
            </PatchHorizontalButtons>
            </Grid>
            <Grid item xs>
            <PatchSpriteDetails width={"100%"} height={"calc(100vh - 460px)"} costumeIndex={currentCostumeIndex} costumes={currentCostumes} />
            </Grid>
            <Grid item xs>
            <Box sx={{overflowY: "scroll", maxHeight: "280px"}}>
            <Grid container direction="row" spacing={1} sx={{
                margin: "0px",
                backgroundColor: 'panel.default',
                borderTopWidth: "2px",
                borderTopStyle: "solid",
                borderTopColor: 'divider',
                padding: "4px",
                width: "100%",
                marginBottom: "8px",
            }}>
                {currentCostumes.map((costume, i) =>
                    <Grid item>
                        <ItemCard
                            imageSrc={getCostumeUrl(costume.asset)}
                            title={costume.name}
                            selected={i === currentCostumeIndex}
                            onClick={handleClick}
                            //actionButtons={costumes.length > 1 ? [deleteCostumeButton(costume.name)] : []}
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