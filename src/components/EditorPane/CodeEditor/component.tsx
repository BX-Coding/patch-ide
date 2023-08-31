import React, { useCallback, useEffect } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import SplitPane, { Pane } from 'react-split-pane-next';
import usePatchStore from '../../../store';
import { ThreadBar } from './ThreadBar';
import PatchCodeMirror from './PatchCodeMirror/component';
import { HorizontalButtons, TextButton } from '../../PatchButton';

export const CodeEditor = () => {
    const threads = useThreads();
    const currentThreadId = useGetCodeThreadId();

    const setCurrentThreadId = usePatchStore((state) => state.setCodeThreadId);

    return (
        <Grid container direction="column" className="assetHolder" spacing={0} sx={{
            backgroundColor: 'panel.main',
            borderColor: 'divider',
            minHeight: "calc(100% - 40px)",
            marginBottom: "0px",
            padding: "8px",
        }}>
            <HorizontalButtons sx={{borderBottomWidth: "1px", borderBottomColor: "divider", borderBottomStyle: "solid", marginLeft: "-8px", marginRight: "-12px", marginTop: "-12px", paddingTop: "8px", paddingBottom: "6px", width: "calc(100% + 18px)"}}>
                {threads.map((thread, i) =>
                    <Button variant={thread.thread.id === currentThreadId ? "contained" : "outlined"} onClick={() => { setCurrentThreadId(thread.thread.id); }}>{thread.thread.displayName}</Button>
                )}
            </HorizontalButtons>
            {threads.map((threadState, i) => {
                return (<Box flexDirection={"column"} display={threadState.thread.id === currentThreadId ? "flex" : "none"}>
                    <ThreadBar thread={threadState.thread} deletable={threads.length > 1} />
                    <PatchCodeMirror thread={threadState.thread} />
                </Box>
                )
            })
            }
        </Grid>
    );
}
// Returns an array of threads
const useThreads = () => {
    const threads = usePatchStore((state) => state.threads);

    return Object.values(threads);
}

const useGetCodeThreadId = () => usePatchStore((state) => state.getCodeThreadId());

export default CodeEditor;
