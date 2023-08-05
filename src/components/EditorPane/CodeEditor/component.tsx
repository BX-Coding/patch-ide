//@ts-nocheck
import React from 'react';
import { Grid, Typography } from '@mui/material';
import SplitPane, { Pane } from 'react-split-pane-next';
import usePatchStore from '../../../store';
import { ThreadEditor } from './ThreadEditor'

export const CodeEditor = () => {
    return (
        <Grid container direction="column" className="assetHolder" sx={{
            backgroundColor: 'panel.default',
            borderColor: 'divider',
            minHeight: "calc(100% - 40px)",
            marginBottom: "0px",
            padding: "8px"
        }}>
            <SplitPane split="vertical">
                {threads.map((threadState, i) => 
                <Pane initialSize={`${100/threads.length}%`}>
                    <ThreadEditor thread={threadState.thread} first={i === 0} final={i === (threads.length - 1)}/>
                </Pane>)}
            </SplitPane>
        </Grid>
    );
}

export default CodeEditor;
