import React, { useContext, useState } from 'react';
import { PyatchAddSprite } from "./PyatchAddSprite.jsx"; //plus button
import { PyatchDeleteSprite } from "./PatchDeleteSprite.jsx"; //clear button
import { PyatchSelectSprite } from "./PyatchSelectSprite.jsx"; //sprite name button
import { PyatchSpriteAttributes } from "./PyatchSpriteAttributes.jsx"; //height and stuff
import { PyatchSpriteName } from "./PyatchSpriteName.jsx"; //textfeild
import pyatchContext from './provider/PyatchContext.js';
import Grid from '@mui/material/Grid';

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
            <Grid container sx={{ alignItems: 'center' }}>
                 {editingTarget && <Grid item xs={12}>
                    <PyatchSpriteName target={editingTarget}/>
                    <PyatchDeleteSprite/>
                </Grid>}
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                    {targetIds.map((targetId) => {
                        const target = pyatchVM.runtime.getTargetById(targetId);
                        return (target ? ((target.isSprite() && !target.sprite.isStage) && <PyatchSelectSprite key={target.id} target={target}/>) : <></>)
                    })}
                </Grid>
            </Grid>
            <Grid container sx={{ alignItems: 'center' }}>
                <Grid item xs={6}>
                    <PyatchAddSprite/>
                </Grid>
                <Grid item xs={6}>
                    <StageButton/>
                </Grid>
            </Grid>
        </Grid>
    );
}