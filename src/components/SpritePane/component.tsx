import React, { useContext, useState } from 'react';
import { AddSpriteButton } from "./AddSpriteButton.jsx"; //plus button
import { DeleteSpriteButton } from "./DeleteSpriteButton.jsx"; //clear button
import { SpriteCard } from "./SpriteCard.jsx"; //sprite name button
import { SpriteAttributePane } from "./SpriteAttributeArea.js"; //height and stuff
import { SpriteName } from "./SpriteName.jsx"; //textfeild

import Grid from '@mui/material/Grid';

import { HorizontalButtons } from '../PatchButton/component.jsx';
import usePatchStore from '../../store/index.js';

function StageButton() {
    const patchVM = usePatchStore((state) => state.patchVM);
    const stageTarget = patchVM.runtime.getTargetForStage();

    return <>{stageTarget && <SpriteCard key={stageTarget.id} target={stageTarget}/>}</>;
}

export default function SpritePane(){
    const patchVM = usePatchStore((state) => state.patchVM);
    const targetIds = usePatchStore((state) => state.targetIds);
    const editingTargetId = usePatchStore((state) => state.editingTargetId);

    if (!patchVM) {
        return null;
    }

    const editingTarget = patchVM.runtime.getTargetById(editingTargetId);

    return(
        <Grid>
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
            <Grid container direction="row" spacing={"8px"} xs={12} sx={{
                backgroundColor: 'panel.default',
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
                        target ? ((target.isSprite() && !target.sprite.isStage) && <Grid item sx={{maxWidth: '136px', maxHeight: '136px'}}><SpriteCard key={target.id} target={target} /></Grid>) : <></>
                    );
                })}
                <Grid item>
                    <StageButton/>
                </Grid>
            </Grid>
        </Grid>
    );
}