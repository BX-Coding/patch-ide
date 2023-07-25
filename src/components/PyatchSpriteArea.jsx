import React, { useContext, useState } from 'react';
import { PyatchAddSprite } from "./PyatchAddSprite.jsx"; //plus button
import { PyatchDeleteSprite } from "./PatchDeleteSprite.jsx"; //clear button
import { PyatchSelectSprite } from "./PyatchSelectSprite.jsx"; //sprite name button
import { PyatchSpriteAttributes } from "./PyatchSpriteAttributes.jsx"; //height and stuff
import { PyatchSpriteName } from "./PyatchSpriteName.jsx"; //textfeild
import pyatchContext from './provider/PyatchContext.js';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import { ItemCard } from './PatchTemplates.jsx';

import { PatchHorizontalButtons } from './PatchTemplates.jsx';
import PyatchStage from './PyatchStage.jsx';

function StageButton() {
    const { pyatchVM } = useContext(pyatchContext);
    const stageTarget = pyatchVM.runtime.getTargetForStage();

    return <>{stageTarget && <PyatchSelectSprite key={stageTarget.id} target={stageTarget}/>}</>;
}

export default function PyatchSpriteArea(){
    const { pyatchVM, targetIds, editingTargetId } = useContext(pyatchContext);
    if (!pyatchVM) {
        return null;
    }
    const editingTarget = pyatchVM.runtime.getTargetById(editingTargetId);

    return(
        <Grid>
            <Grid container justifyContent = "center">
                <Grid item xs={12}>
                    <PyatchSpriteAttributes/>
                </Grid>
            </Grid>
            <Grid container direction="row" sx={{ alignItems: 'center', justifyItems: 'center' }}>
                {editingTarget && <Grid item xs={12}>
                    <PyatchSpriteName target={editingTarget} />
                </Grid>}
            </Grid>
            <PatchHorizontalButtons sx={{borderWidth: '0px', marginLeft: '-8px', marginRight: '-8px', width: 'calc(100% + 16px)', padding: '4px', paddingBottom: '8px', marginBottom: '0px', borderTopWidth: '1px', borderBottomWidth: '1px', borderColor: 'divider', borderStyle: 'solid'}}>
                {editingTarget && <PyatchDeleteSprite /> }
                <PyatchAddSprite />
            </PatchHorizontalButtons>
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
                    const target = pyatchVM.runtime.getTargetById(targetId);
                    return (
                        target ? ((target.isSprite() && !target.sprite.isStage) && <Grid item sx={{maxWidth: '136px', maxHeight: '136px'}}><PyatchSelectSprite key={target.id} target={target} /></Grid>) : <></>
                    );
                })}
                <Grid item>
                    <StageButton/>
                </Grid>
            </Grid>
        </Grid>
    );
}