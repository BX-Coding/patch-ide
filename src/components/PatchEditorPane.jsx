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
import AddReactionIcon from '@mui/icons-material/AddReaction';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import { Typography, Box } from '@mui/material';
import PatchCodeEditor from './PatchCodeEditor.jsx'

import { PatchInternalSpriteChooser } from './PatchInternalSpriteChooser.jsx';

export function PatchEditorPane(props) {
    const { patchEditorTab } = useContext(pyatchContext);

    return <div class="tabContent">
        {[<PatchCodeEditor />, <PatchSpriteEditor />][patchEditorTab]}
    </div>
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

export function PatchSpriteEditor(props) {
    return (
        <Grid container marginTop="8px">
            <Grid item>
                <PatchSpriteInspector />
            </Grid>
            <Grid item>
                <PatchSoundInspector />
            </Grid>
            <Grid item>
                <PatchGlobalVariables />
            </Grid>
        </Grid>
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

function PatchGlobalVariables(props) {
    return <>
        <Grid><PatchVariables /></Grid>
    </>;
}

function ItemCard(props) {
    const { imageSrc, title, selected, onClick, actionButtons } = props;
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
        }}

            onClick={() => { onClick(title) }}
        >
            <Box sx={{
                display: 'flex',
                justifyContent: 'center',
            }}><img src={imageSrc} width={100} /></Box>
            <Grid display='flex' justifyContent='space-between' alignItems='center' sx={{
                backgroundColor: 'primary.dark',
                padding: 1,
            }}>
                <Typography>{title}</Typography>
                {actionButtons}
            </Grid>
        </Box>)
}

function AddCostumeButton(props) {
    const { handleUploadCostume, setShowInternalChooser, setInternalChooserAdd, internalChooserUpdate, setInternalChooserUpdate } = useContext(pyatchContext);
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
        setInternalChooserUpdate(!internalChooserUpdate);
    }

    return <>
        <Button
            id='addNewCostume'
            varient='contained'
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
}

function PatchSoundInspector(props) {
    const { pyatchVM, editingTargetId, soundsUpdate } = useContext(pyatchContext);
    let selectedTarget = pyatchVM.editingTarget;
    let targtSounds = selectedTarget.getSounds();

    const [soundIndex, setSoundIndex] = useState(Math.min(targtSounds.length - 1, 0));

    const handleClick = (index, soundName) => () => {
        // Copy name to clipboard
        // navigator.clipboard.writeText(soundName);
        setSoundIndex(index);
    }

    const copyButton = (soundName) => <Button sx={{color: 'white'}} onClick={() => { navigator.clipboard.writeText(soundName); }}><ContentCopyIcon /></Button>

    return (
        <div class="assetHolder">
            {targtSounds.map((sound, i) =>
                <ItemCard
                    imageSrc={"https://cdn-icons-png.flaticon.com/512/3601/3601680.png"}
                    title={sound.name}
                    selected={i === soundIndex}
                    onClick={handleClick(i, sound.name)}
                    actionButtons={[copyButton(sound.name)]}
                    key={sound.name}
                />)}
        </div>
    );
}

function PatchSpriteInspector(props) {
    const { pyatchVM, editingTargetId, costumesUpdate, setCostumesUpdate } = useContext(pyatchContext);
    let selectedTarget = pyatchVM.editingTarget;
    let currentCostume = selectedTarget.getCurrentCostume();

    let [costumeIndex, setCostumeIndex] = useState(selectedTarget.getCostumeIndexByName(currentCostume.name));
    let [costumes, setCostumes] = useState(selectedTarget.getCostumes());

    const handleClick = (costumeName) => {
        const newCostumeIndex = selectedTarget.getCostumeIndexByName(costumeName);
        selectedTarget.setCostume(newCostumeIndex)
        setCostumeIndex(newCostumeIndex);
    }

    const handleDeleteClick = (costumeName) => {
        const newCostumeIndex = selectedTarget.getCostumeIndexByName(costumeName);
        selectedTarget.deleteCostume(newCostumeIndex)
        setCostumeIndex(selectedTarget.currentCostume);
        setCostumesUpdate(!costumesUpdate);
    }

    const deleteCostumeButton = (costumeName) => <Button color='error' onClick={() => handleDeleteClick(costumeName)}><DeleteIcon /></Button>

    useEffect(() => {
        selectedTarget = pyatchVM.runtime.getTargetById(editingTargetId);
        currentCostume = selectedTarget.getCurrentCostume();
        setCostumeIndex(selectedTarget.getCostumeIndexByName(currentCostume.name));
        setCostumes(selectedTarget.getCostumes());
    }, [editingTargetId, costumesUpdate]);

    return (
        <div class="assetHolder">
            {costumes.map((costume, i) =>
                <ItemCard
                    imageSrc={getCostumeUrl(costume.asset)}
                    title={costume.name}
                    selected={i === costumeIndex}
                    onClick={handleClick}
                    actionButtons={costumes.length > 1 ? [deleteCostumeButton(costume.name)] : []}
                    key={costume.name}
                />)}
            <AddCostumeButton targetId={selectedTarget.id} setCostumeIndex={setCostumeIndex} />
        </div>
    );
}