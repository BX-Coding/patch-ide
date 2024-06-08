import React, { useCallback, useEffect, useState, useRef } from 'react';
import { Box, Button, Grid, Typography } from '@mui/material';
import SplitPane, { Pane } from 'react-split-pane-next';
import usePatchStore from '../../../store';
import { ThreadBar } from './ThreadBar';
import PatchCodeMirror from './PatchCodeMirror/component';
import { HorizontalButtons, TextButton } from '../../PatchButton';
import { languageServer } from "codemirror-languageserver";

export const CodeEditor = () => {

    const [lspConnectionState, setLspConnectionState] = useState<any>(null);
    const setWebSocketRef = usePatchStore(state => state.setWebSocketRef);
    
    useEffect(() => {

        // const serverUri = `ws://localhost:8081` as `ws://${string}` | `wss://${string}`;
        const serverUri = `${process.env.LSP_SERVER_URL}` as `ws://${string}` | `wss://${string}`;

        function generateUniqueRootUri(length: number): string {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
            let result = '';
            const charactersLength = characters.length;
            for (let i = 0; i < length; i++) {
                result += characters.charAt(Math.floor(Math.random() * charactersLength));
            }
            return result;
        }
    
        const socket = new WebSocket(serverUri)
        setWebSocketRef(socket)
        
        const ls = languageServer({
            serverUri,
            rootUri: `file:///${generateUniqueRootUri(10)}`,
            documentUri: "file:///index.js",
            languageId: "python",
            workspaceFolders: null,
        });

        setLspConnectionState(ls);
        
    }, []);

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
                    <PatchCodeMirror thread={threadState.thread} lspConnectionState={lspConnectionState}/>
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
