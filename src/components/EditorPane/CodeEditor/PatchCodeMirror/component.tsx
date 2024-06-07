// Keeping this file in jsx for now in order to use the CodeMirror component see error triage BXC-210
import React, { useEffect, useState, useRef } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { autocompletion } from "@codemirror/autocomplete";
import { lintGutter } from "@codemirror/lint";
import pythonLinter from "../../../../util/python-syntax-lint";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";
import completions from "../../../../util/patch-autocompletions";
import { Thread } from "../../types";
import usePatchStore from "../../../../store";
import { useRuntimeDiagnostics } from "../../../../hooks/useRuntimeDiagnostics";

type PatchCodeMirrorProps = {
  thread: Thread;
  lspConnectionState: any;
};

const PatchCodeMirror = ({ thread, lspConnectionState}: PatchCodeMirrorProps) => {
  const codemirrorRef = useRef<ReactCodeMirrorRef>(null);
  const setCodemirrorRef = usePatchStore((state) => state.setCodemirrorRef);

  const getThread = usePatchStore((state) => state.getThread);
  const updateThread = usePatchStore((state) => state.updateThread);
  const setProjectChanged = usePatchStore((state) => state.setProjectChanged);
  const { getDiagnostics, invalidateDiagnostics } = useRuntimeDiagnostics(
    thread.id
  );

  useEffect(() => {
    setCodemirrorRef(thread.id,codemirrorRef);
  }, [codemirrorRef, setCodemirrorRef]);

  const handleCodeChange = (newScript: string) => {
    updateThread(thread.id, newScript);
    setProjectChanged(true);
    invalidateDiagnostics(thread.id);
  };

  return (
    <>
      <CodeMirror
        ref={codemirrorRef}
        value={getThread(thread.id).text}
        theme="dark"
        extensions={[
          python(),
          lspConnectionState,
          // autocompletion({ override: [completions(patchVM)] }),
          pythonLinter((_) => {}, getDiagnostics),
          lintGutter(),
          indentationMarkers(),
        ]}
        onChange={handleCodeChange}
        height="calc(100vh - 209px)"
      />
    </>
  );
};

export default PatchCodeMirror;
