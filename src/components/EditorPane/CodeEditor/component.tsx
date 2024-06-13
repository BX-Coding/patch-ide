import React, { useCallback, useEffect, useState, useRef } from "react";
import { Box, Button, Grid, Typography } from "@mui/material";
import SplitPane, { Pane } from "react-split-pane-next";
import usePatchStore from "../../../store";
import { ThreadBar } from "./ThreadBar";
import PatchCodeMirror from "./PatchCodeMirror/component";
import { HorizontalButtons, TextButton } from "../../PatchButton";
import {
  LanguageServerClient,
  languageServer,
  languageServerWithTransport,
} from "codemirror-languageserver";
import { createWSTransport } from "../../../store/codeEditorStore";
import { once } from "../../../store/codeEditorStore";


export const CodeEditor = () => {
  const [lspConnectionState, setLspConnectionState] = useState<any>(null);

  const setCurrentThreadId = usePatchStore((state) => state.setCodeThreadId);
  const setTransport = usePatchStore((state)=>state.setTransportRef)

  useEffect(() => {
    const serverUri = `ws://localhost:8000` as
      | `ws://${string}`
      | `wss://${string}`;
    // const serverUri = `${process.env.LSP_SERVER_URL}` as
    //   | `ws://${string}`
    //   | `wss://${string}`;

    const transport = createWSTransport(serverUri);
    setTransport(transport)

    const getCopilotClient = once(() =>
      languageServerWithTransport({
        rootUri: `file:///`,
        documentUri: "file:///index.js",
        languageId: "python",
        workspaceFolders: null,
        transport: transport,
      })
    );

    const ls = getCopilotClient();

    setLspConnectionState(ls);
  }, []);

  const threads = useThreads();
  const currentThreadId = useGetCodeThreadId();

  return (
    <Grid
      container
      direction="column"
      className="assetHolder"
      spacing={0}
      sx={{
        backgroundColor: "panel.main",
        borderColor: "divider",
        minHeight: "calc(100% - 40px)",
        marginBottom: "0px",
        padding: "8px",
      }}
    >
      <HorizontalButtons
        sx={{
          borderBottomWidth: "1px",
          borderBottomColor: "divider",
          borderBottomStyle: "solid",
          marginLeft: "-8px",
          marginRight: "-12px",
          marginTop: "-12px",
          paddingTop: "8px",
          paddingBottom: "6px",
          width: "calc(100% + 18px)",
        }}
      >
        {threads.map((thread, i) => (
          <Button
            variant={
              thread.thread.id === currentThreadId ? "contained" : "outlined"
            }
            onClick={() => {
              setCurrentThreadId(thread.thread.id);
            }}
          >
            {thread.thread.displayName}
          </Button>
        ))}
      </HorizontalButtons>
      {threads.map((threadState, i) => {
        return (
          <Box
            flexDirection={"column"}
            display={
              threadState.thread.id === currentThreadId ? "flex" : "none"
            }
          >
            <ThreadBar
              thread={threadState.thread}
              deletable={threads.length > 1}
            />
            <PatchCodeMirror
              thread={threadState.thread}
              lspConnectionState={lspConnectionState}
            />
          </Box>
        );
      })}
    </Grid>
  );
};
// Returns an array of threads
const useThreads = () => {
  const threads = usePatchStore((state) => state.threads);

  return Object.values(threads);
};

const useGetCodeThreadId = () =>
  usePatchStore((state) => state.getCodeThreadId());

export default CodeEditor;
