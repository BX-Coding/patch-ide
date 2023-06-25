import React, { useContext, useState } from 'react';
import { PyatchAddSprite } from "./PyatchAddSprite.jsx"; //plus button
import { PyatchDeleteSprite } from "./PatchDeleteSprite.jsx"; //clear button
import { PyatchSelectSprite } from "./PyatchSelectSprite.jsx"; //sprite name button
import { PyatchSpriteAttributes } from "./PyatchSpriteAttributes.jsx"; //height and stuff
import { PyatchSpriteName } from "./PyatchSpriteName.jsx"; //textfeild
import pyatchContext from './provider/PyatchContext.js';
import Grid from '@mui/material/Grid';

export default function PyatchSpriteArea(){
    const { pyatchVM } = useContext(pyatchContext);
    const vmTargets = pyatchVM ? pyatchVM.getAllRenderedTargets() : [];
    const [targets, setTargets] = useState(vmTargets);
    const vmEditingTarget = pyatchVM ? pyatchVM.editingTarget : null;
    const [editingTarget, setEditingTarget] = useState(vmEditingTarget);

    
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
                    {targets.map((target) => {
                        return (target.isSprite() && target.sprite.name !== "Background") && <PyatchSelectSprite key={target.id} target={target}/>
                    })}
                </Grid>
            </Grid>
            <Grid container sx={{ alignItems: 'center' }}>
                <Grid item xs={12}>
                    <PyatchAddSprite/>
                </Grid>
            </Grid>
        </Grid>
    );
}