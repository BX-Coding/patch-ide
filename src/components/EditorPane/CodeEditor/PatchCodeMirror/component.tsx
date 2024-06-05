// Keeping this file in jsx for now in order to use the CodeMirror component see error triage BXC-210
import React, { useState, useEffect, useRef } from "react";

import CodeMirror from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { autocompletion } from "@codemirror/autocomplete";
import { lintGutter } from "@codemirror/lint";
import pythonLinter from "../../../../util/python-syntax-lint";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";
import completions from "../../../../util/patch-autocompletions";
import { Thread } from "../../types";
import usePatchStore from "../../../../store";
import { useRuntimeDiagnostics } from "../../../../hooks/useRuntimeDiagnostics";
import { languageServer } from "codemirror-languageserver";
import {hoverTooltip} from "@codemirror/view";
import patchAPI from "../../../../../public/patch-api.json"

type PatchCodeMirrorProps = {
  thread: Thread;
};

const PatchCodeMirror = ({ thread }: PatchCodeMirrorProps) => {
  // New LSP server state and refs
  const wsRef = useRef<WebSocket | null>(null);
  const [lspConnectionState, setLspConnectionState] = useState<any>();

  // const patchVM = usePatchStore((state) => state.patchVM);
  const getThread = usePatchStore((state) => state.getThread);
  const updateThread = usePatchStore((state) => state.updateThread);
  const setProjectChanged = usePatchStore((state) => state.setProjectChanged);
  const { getDiagnostics, invalidateDiagnostics } = useRuntimeDiagnostics(
    thread.id
  );

  const wordHover = hoverTooltip((view, pos, side) => {
    let {from, to, text} = view.state.doc.lineAt(pos)
    let start = pos, end = pos
    while (start > from && /\w/.test(text[start - from - 1])) start--
    while (end < to && /\w/.test(text[end - from])) end++
    if (start == pos && side < 0 || end == pos && side > 0)
      return null
    return {
      pos: start,
      end,
      above: true,
      create(view) {
        let dom = document.createElement("div")
        //determine position
        let txt = "";
        patchAPI["patch-functions"].forEach(function(x){
            if (x["name"] == text.slice(start - from, end - from)) {
              txt = x["name"]
              txt = "Name: " + x["name"] + "\nDescription: " + x["description"]
              + "\nParameters:" + x["parameters"] + "\nExample:" + x["exampleUsage"]
            }
        });
        if (txt == "") {
          return {dom}
        }

        dom.textContent = txt;
        return {dom}
      }
    }
  })

  useEffect(() => {
    const serverUri = `${process.env.LSP_SERVER_URL}` as
      | `ws://${string}`
      | `wss://${string}`;

    wsRef.current = new WebSocket(serverUri);

    const ls = languageServer({
      serverUri,
      rootUri: "file:///",
      documentUri: "file:///index.js",
      languageId: "python",
      workspaceFolders: null,
    });

    setLspConnectionState(ls);
  }, []);

  const handleCodeChange = (newScript: string) => {
    updateThread(thread.id, newScript);
    setProjectChanged(true);
    invalidateDiagnostics(thread.id);
  };

  return (
    <>
      <CodeMirror
        value={getThread(thread.id).text}
        theme="dark"
        extensions={[
          python(),
          lspConnectionState,
          // autocompletion({ override: [completions(patchVM)],}),
          pythonLinter((_) => {}, getDiagnostics),
          lintGutter(),
          indentationMarkers(),
          wordHover
        ]}
        onChange={handleCodeChange}
        height="calc(100vh - 209px)"
      />
    </>
  );
};

export default PatchCodeMirror;
