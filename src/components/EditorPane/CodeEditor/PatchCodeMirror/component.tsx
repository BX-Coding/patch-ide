// Keeping this file in jsx for now in order to use the CodeMirror component see error triage BXC-210
import React, { useEffect, useState, useRef } from "react";
import CodeMirror, { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import { python } from "@codemirror/lang-python";
import { lintGutter } from "@codemirror/lint";
import pythonLinter from "../../../../util/python-syntax-lint";
import { indentationMarkers } from "@replit/codemirror-indentation-markers";
import { Thread } from "../../types";
import usePatchStore from "../../../../store";
import { useRuntimeDiagnostics } from "../../../../hooks/useRuntimeDiagnostics";
import { hoverTooltip } from "@codemirror/view";
import patchAPI from "../../../../assets/patch-api.json";
import { createRoot } from "react-dom/client";
import { HoverTooltip } from "../HoverTooltip";
import { Button } from "@mui/material";

type PatchCodeMirrorProps = {
  thread: Thread;
  lspConnectionState: any;
};

const PatchCodeMirror = ({
  thread,
  lspConnectionState,
}: PatchCodeMirrorProps) => {
  const codemirrorRef = useRef<ReactCodeMirrorRef>(null);
  const setCodemirrorRef = usePatchStore((state) => state.setCodemirrorRef);
  const transport = usePatchStore((state) => state.transportRef);
  const handleFormat = () => {
      const formatRequest = {
        internalID: 1,
        request: {
          jsonrpc: "2.0" as const,
          id: 1,
          method: "textDocument/formatting",
          params: {
            textDocument: {
              uri: "file:///index.js",
            },
            options: {
              tabSize: 4,
              insertSpaces: true,
            },
          },
        }
      };
    if (transport) {
      transport.sendData(formatRequest)
      .then((event) => {
        if (event != null) {
          const response = JSON.parse(JSON.stringify(event[0]));
          handleCodeChange(response.newText);
        }
      });
    }
  }


  const getThread = usePatchStore((state) => state.getThread);
  const updateThread = usePatchStore((state) => state.updateThread);
  const setProjectChanged = usePatchStore((state) => state.setProjectChanged);
  const { getDiagnostics, invalidateDiagnostics } = useRuntimeDiagnostics(
    thread.id
  );

  const wordHover = hoverTooltip((view, pos, side) => {
    let { from, to, text } = view.state.doc.lineAt(pos);
    let start = pos,
      end = pos;
    while (start > from && /\w/.test(text[start - from - 1])) start--;
    while (end < to && /\w/.test(text[end - from])) end++;
    if ((start == pos && side < 0) || (end == pos && side > 0)) return null;
    return {
      pos: start,
      end,
      above: true,
      create(view) {
        const dom = document.createElement("div");
        const root = createRoot(dom);
        let funName = "";
        let functionDeclaration = "";
        let description = "";
        let exampleCode = "";
        patchAPI["patch-functions"].forEach(function (x) {
          if (x["name"] == text.slice(start - from, end - from)) {
            funName = x["name"];
            functionDeclaration = x["name"] + getParamText(x["parameters"]);
            description = x["description"];
            exampleCode = x["exampleUsage"];
          }
        });
        let imgSrc =
          "https://firebasestorage.googleapis.com/v0/b/patch-271d1.appspot.com/o/gifs%2F" +
          funName +
          ".gif?alt=media";
        if (funName != "") {
          root.render(
            <HoverTooltip
              declare={functionDeclaration}
              descript={description}
              exampleCode={exampleCode}
              imgSrc={imgSrc}
            />
          );
        }
        return { dom };
      },
    };
  });

  useEffect(() => {
    setCodemirrorRef(thread.id, codemirrorRef);
  }, [codemirrorRef, setCodemirrorRef]);

  const handleCodeChange = (newScript: string) => {
    updateThread(thread.id, newScript);
    setProjectChanged(true);
    invalidateDiagnostics(thread.id);
    // const didChangeConfigurationParams = {
    //   jsonrpc: "2.0" as const,
    //   id: 1,
    //   method: "workspace/didChangeConfiguration",
    //   params: {
    //     settings: {
    //       exampleSetting: "exampleValue",
    //     },
    //   },
    // };
    // sendState(didChangeConfigurationParams)
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
          wordHover,
        ]}
        onChange={handleCodeChange}
        height="calc(100vh - 209px)"
      />
      <Button onClick={handleFormat} >Align</Button>
    </>
  );
};

function getParamText(object: any) {
  let text = "(";
  for (var key in object) {
    text += key + ": " + object[key] + ", ";
  }
  if (text.length > 1) {
    text = text.substring(0, text.length - 2);
  }
  text += ")";
  return text;
}
export default PatchCodeMirror;
