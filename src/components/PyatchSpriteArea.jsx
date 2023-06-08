import React, { useContext } from 'react';
import { PyatchAddSprite } from "./PyatchAddSprite.jsx"; //plus button
import { PyatchDeleteSprite } from "./PatchDeleteSprite.jsx"; //clear button
import { PyatchSelectSprite } from "./PyatchSelectSprite.jsx"; //sprite name button
import { PyatchSpriteAttributes } from "./PyatchSpriteAttributes.jsx"; //height and stuff
import { PyatchSpriteName } from "./PyatchSpriteName.jsx"; //textfeild
import pyatchContext from './provider/PyatchContext.js';
import Grid from '@mui/material/Grid';

export default function PyatchSpriteArea(){
    let { sprites } = useContext(pyatchContext);
    
    return(
        <Grid>
            <Grid container justifyContent = "center">
                <Grid item xs={12}>
                    <PyatchSpriteAttributes/>
                </Grid>
            </Grid>
            <Grid container sx={{ alignItems: 'center' }}>
                <Grid item xs={12}>
                    {sprites.map((sprite) => {
                        return <PyatchSpriteName key={sprite} spriteID={sprite}/>
                        })}
                        <PyatchDeleteSprite/>
                </Grid>
            </Grid>
            <Grid container>
                <Grid item xs={12}>
                {sprites.map((sprite) => {
                return <PyatchSelectSprite key={sprite} spriteID={sprite}/>
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