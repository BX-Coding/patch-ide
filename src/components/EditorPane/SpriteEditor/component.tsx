import React, { useContext, useState } from 'react';
import usePatchStore, { ModalSelectorType } from '../../../store';
import getCostumeUrl from '../../../util/get-costume-url';
import { AddButton, DeleteButton, HorizontalButtons } from '../../PatchButton';
import { ItemCard } from '../../ItemCard';
import { Box, Grid, Menu, MenuItem } from '@mui/material';
import { handleUploadCostume } from './handleUpload';
import { Costume, Target } from '../types';
import { useEditingTarget } from '../../../hooks/useEditingTarget';
import { CostumeImage } from '../../CostumeImage';


export function SpriteEditor() {
    return (
        <Grid container>
            <Grid item xs={12}>
                <SpriteInspector />
            </Grid>
        </Grid>
    );
}


function AddCostumeButton() {
    const showModalSelector = usePatchStore((state) => state.showModalSelector);
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
        showModalSelector(ModalSelectorType.COSTUME);
    }

    const handleFromUpload = () => {
        handleUploadCostume(); 
        handleClose();
    }

    return (
        <>
            <AddButton variant='contained' onClick={handleClick}/>
            <Menu
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                    'aria-labelledby': 'basic-button',
                }}
            >
                <MenuItem id="builtin" onClick={handleBuiltIn}>From Built-In</MenuItem>
                <MenuItem id="upload" onClick={handleFromUpload}>From Upload</MenuItem>
            </Menu>
        </>
    );
}

type SpriteDetailsProps = {
    costumeIndex: number,
    costumes: Costume[],
    width: string,
    height: string
}

function SpriteDetails({ costumeIndex, costumes, width, height }: SpriteDetailsProps) {
    return (
        <Grid container direction="row" spacing={2} sx={{
            width: width,
            height: height,
        }}>
            <Grid item xs={12} sx={{
                maxWidth: width,
                maxHeight: height
            }}>
                <CostumeImage costume={costumes[costumeIndex]} className="assetDetailsImage"/>
            </Grid>
        </Grid>
    );
}

function SpriteInspector() {
    const setSelectedCostumeIndex = usePatchStore((state) => state.setSelectedCostumeIndex);
    const selectedCostumeIndex = usePatchStore((state) => state.selectedCostumeIndex);
    const setCostumes = usePatchStore((state) => state.setCostumes);
    const costumes = usePatchStore((state) => state.costumes);

    const [editingTarget, setEditingTarget] = useEditingTarget() as [Target, (target: Target) => void];

    const handleClick = (costumeName: string) => {
        const newCostumeIndex = editingTarget.getCostumeIndexByName(costumeName);
        editingTarget.setCostume(newCostumeIndex);
        setSelectedCostumeIndex(newCostumeIndex);
    }

    const handleDeleteClick = (costumeName: string) => {
        const newCostumeIndex = editingTarget.getCostumeIndexByName(costumeName);
        editingTarget.deleteCostume(newCostumeIndex);
        setSelectedCostumeIndex(editingTarget.currentCostume);
        setCostumes([...editingTarget.getCostumes()]);
    }

    const handleDeleteCurrentClick = () => {
        handleDeleteClick(costumes[selectedCostumeIndex].name);
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
                    <Grid item><AddCostumeButton /></Grid>
                    <Grid item><DeleteButton disabled={costumes.length === 1} red={true} variant={"contained"} onClick={handleDeleteCurrentClick} onClickArgs={[]} /></Grid>
                </HorizontalButtons>
            </Grid>
            <Grid item xs>
                <SpriteDetails width={"100%"} height={"calc(100vh - 460px)"} costumeIndex={selectedCostumeIndex} costumes={costumes} />
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
                        {costumes.map((costume, i) =>
                            <Grid item key={i}>
                                <ItemCard
                                    title={costume.name}
                                    selected={i === selectedCostumeIndex}
                                    onClick={handleClick}
                                    key={costume.name}
                                    width={120}
                                    height={120}
                                >
                                    <CostumeImage costume={costume} className="costumeCardImage"/>
                                </ItemCard>
                            </Grid>
                        )}
                    </Grid>
                </Box>
            </Grid>
        </Grid>
    );
}