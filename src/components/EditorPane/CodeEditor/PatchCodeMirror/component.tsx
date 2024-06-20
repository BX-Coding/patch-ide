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
import { languageServer } from "codemirror-languageserver";
import {hoverTooltip} from "@codemirror/view";
import patchAPI from "../../../../assets/patch-api.json"

type PatchCodeMirrorProps = {
  thread: Thread;
  lspConnectionState: any;
};

const PatchCodeMirror = ({ thread, lspConnectionState}: PatchCodeMirrorProps) => {
  const codemirrorRef = useRef<ReactCodeMirrorRef>(null);
  const setCodemirrorRef = usePatchStore((state) => state.setCodemirrorRef);

  // const sendState = usePatchStore((state)=>state.sendLspState)

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

        let txt = "";
        let titleTxt = "";
        let funName = "";
        let title = dom.appendChild(document.createElement("h4"));
        let descript = dom.appendChild(document.createElement("p"));
        let image = dom.appendChild(document.createElement("img"));
        patchAPI["patch-functions"].forEach(function(x){
            if (x["name"] == text.slice(start - from, end - from)) {
              funName = x["name"];
              titleTxt = x["name"] + getParamText(x["parameters"]);
              txt = x["description"]
              + "\n\nExample: " + x["exampleUsage"]
            }
        });
        title.innerText = titleTxt;
        descript.innerText = txt;
        title.style.marginTop = '0px';
        title.style.marginBottom = '5px';
        descript.style.marginTop = '0px';
        image.style.maxWidth = '300px';
        image.style.display = 'block';
        image.style.marginLeft = 'auto';
        image.style.marginRight = 'auto';
        dom.style.maxWidth = '300px';
        image.onerror = (e) => {
          image.src = "no-image.png";
        }
        if (funName != ""){
          image.src = "gifs/" + funName + ".gif"
        }
        return {dom}
      }
    }
  })

  useEffect(() => {
    setCodemirrorRef(thread.id,codemirrorRef);
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
          wordHover
        ]}
        onChange={handleCodeChange}
        height="calc(100vh - 209px)"
      />
    </>
  );
};

function getParamText(object: any) {
  let text = "("
  for (var key in object) {
    text += key + ": " + object[key] + ", "
  }
  if (text.length > 1) {
    text = text.substring(0, text.length - 2);
  }
  text += ")"
  return text;
}
export default PatchCodeMirror;
