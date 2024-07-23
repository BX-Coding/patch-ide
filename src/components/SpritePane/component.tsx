import React, { useContext, useState } from 'react';
import { AddSpriteButton } from "./AddSpriteButton"; //plus button
import { DeleteSpriteButton } from "./DeleteSpriteButton"; //clear button
import { SpriteCard } from "./SpriteCard"; //sprite name button
import { SpriteAttributePane } from "./SpriteAttributeArea"; //height and stuff
import { SpriteName } from "./SpriteName"; //textfeild

import Grid from '@mui/material/Grid';

import { HorizontalButtons } from '../PatchButton';
import usePatchStore from '../../store';
//import { Target } from '../EditorPane/types';
import { useEditingTarget } from '../../hooks/useEditingTarget';
import { useStageTarget } from './useStageTarget';
import { Box } from '@mui/material';
import { Sprite, Stage } from 'leopard';

export default function SpritePane(){
    const patchVM = usePatchStore((state) => state.patchVM);
    const targetIds = usePatchStore((state) => state.targetIds);
    const [editingTarget, setEditingTarget] = useEditingTarget() as [Sprite | Stage, (target: Sprite | Stage) => void];
    
    return(
        <Box className="assetHolder" sx={{
            backgroundColor: 'panel.main',
            padding: "8px",
            paddingTop: "0px",
            borderLeftWidth: "1px",
            borderColor: 'divider',
        }}>
            <Grid container justifyContent = "center">
                <Grid item xs={12}>
                    <SpriteAttributePane/>
                </Grid>
            </Grid>
            <Grid container direction="row" sx={{ alignItems: 'center', justifyItems: 'center' }}>
                {editingTarget && <Grid item xs={12}>
                    <SpriteName/>
                </Grid>}
            </Grid>
            <HorizontalButtons sx={{borderWidth: '0px', marginLeft: '-8px', marginRight: '-8px', width: 'calc(100% + 16px)', padding: '4px', paddingBottom: '8px', marginBottom: '0px', borderTopWidth: '1px', borderBottomWidth: '1px', borderColor: 'divider', borderStyle: 'solid'}}>
                <AddSpriteButton />
                {editingTarget && <DeleteSpriteButton /> }
            </HorizontalButtons>
            <Grid item container direction="row" spacing={"8px"} xs={12} sx={{
                backgroundColor: 'panel.main',
                margin: '-8px',
                marginTop: '0px',
                minWidth: 'calc(100% + 16px)',
                minHeight: '120px',
                height: 'calc(100vh - 649px)',
                maxHeight: 'calc(100vh - 649px)',
                overflowY: 'auto',
                paddingBottom: '8px',
                justifyContent: 'left',
                alignContent: 'start'
            }}>
                {targetIds.map((targetId) => {
                    const target = patchVM.runtime.getTargetById(targetId);
                    return (
                        target ? ((target instanceof Sprite) && <Grid item key={targetId} sx={{maxWidth: '136px', maxHeight: '136px'}}><SpriteCard key={targetId} target={target} /></Grid>) : <></>
                    );
                })}
                <Grid item>
                    <StageButton/>
                </Grid>
            </Grid>
        </Box>
    );
}

function StageButton() {
    const stageTarget = useStageTarget();

    return <>{stageTarget && <SpriteCard key={stageTarget.id} target={stageTarget}/>}</>;
}