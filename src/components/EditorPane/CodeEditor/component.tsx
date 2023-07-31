import React, { useEffect, useState } from 'react';
import { Grid, Typography } from '@mui/material';
import { patchVM } from '../../provider/PatchProvider.jsx';
import SplitPane, { Pane } from 'react-split-pane-next';
import usePatchStore from '../../../store/index.js';
import { ThreadEditor } from './ThreadEditor'

export function CodeEditor() {
    const editingTargetId = patchVM ? patchVM.editingTarget.id : null;
    const targets = patchVM ? patchVM.getAllRenderedTargets() : [];

    const targetSelected = editingTargetId && targets.length===0;

    return (
        <Grid container direction="column" className="assetHolder" sx={{
            backgroundColor: 'panel.default',
            borderColor: 'divider',
            minHeight: "calc(100% - 40px)",
            marginBottom: "0px",
            padding: "8px"
        }}>
            {targetSelected ? <NoSprites/> : <TargetCodeEditor key={editingTargetId}/>}
        </Grid>
    );
}

function NoSprites(){
    return(
        <Typography>No Sprite Selected</Typography>
    );
}

function TargetCodeEditor() {
    const getThreads = usePatchStore((state) => state.getThreads);
    const threads = getThreads();

    // @ts-ignore
    return(
        <SplitPane split="vertical">
            {threads.map((threadState, i) => 
            <Pane initialSize={`${100/threads.length}%`}>
                <ThreadEditor thread={threadState.thread} first={i === 0} final={i === (threads.length - 1)}/>
            </Pane>)}
        </SplitPane>
    );
}

export default CodeEditor;
