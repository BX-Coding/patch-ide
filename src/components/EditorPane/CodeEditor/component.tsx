import React, { useEffect } from 'react';
import { Grid, Typography } from '@mui/material';
import SplitPane, { Pane } from 'react-split-pane-next';
import usePatchStore from '../../../store';
import { ThreadBar } from './ThreadBar';
import PatchCodeMirror from './PatchCodeMirror/component';

export const CodeEditor = () => {
    const threads = useThreads();
    

    return (
        <Grid container direction="column" className="assetHolder" sx={{
            backgroundColor: 'panel.main',
            borderColor: 'divider',
            minHeight: "calc(100% - 40px)",
            marginBottom: "0px",
            padding: "8px"
        }}>
            { /* @ts-ignore */ }
            <SplitPane split="vertical">
                { /* @ts-ignore */ }
                {threads.map((threadState, i) => <Pane initialSize={`${100/threads.length}%`}>
                    <ThreadBar thread={threadState.thread} first={i == 0} final={i == threads.length - 1} />
                    <PatchCodeMirror thread={threadState.thread}/>
                </Pane>)}
            </SplitPane>
        </Grid>
    );
}
// Returns an array of threads
const useThreads = () => {
    const threads = usePatchStore((state) => state.threads);
    
    return Object.values(threads);
}

export default CodeEditor;
