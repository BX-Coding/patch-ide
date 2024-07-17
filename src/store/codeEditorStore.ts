import { StateCreator } from "zustand";
import { EditorState } from "./index";
import { VmError } from "../components/EditorPane/types";
import { ReactCodeMirrorRef } from "@uiw/react-codemirror";
import React from "react";
import { Transport } from "@open-rpc/client-js/build/transports/Transport";
import { WebSocketTransport } from "@open-rpc/client-js";
import { JSONRPCRequestData } from "@open-rpc/client-js/build/Request";
import { LanguageServerState } from "./LanguageServerEditorState";
import { Sprite, Stage } from "leopard";
import { Dictionary } from "../engine/interfaces";
import Thread from "../engine/thread";

export function once<T extends (...args: any[]) => any>(fn: T): T {
  let result: ReturnType<T>;
  let called = false;
  return function (
    this: ThisParameterType<T>,
    ...args: Parameters<T>
  ): ReturnType<T> {
    if (!called) {
      called = true;
      result = fn.apply(this, args) as ReturnType<T>;
    }
    return result;
  } as T;
}

type ThreadState = {
  thread: Thread;
  text: string;
  saved: boolean;
  codeMirrorRef: React.RefObject<ReactCodeMirrorRef> | null;
};

export interface CodeEditorState {
  threads: { [key: string]: ThreadState };
  codeThreadId: string;
  nextThreadNumber: number;
  diagnostics: VmError[];
  diagnosticInvalidated: boolean;
  transportRef: WebSocketTransport | null;

  // Actions
  sendLspState: () => void;
  setTransportRef: (ref: WebSocketTransport) => void;
  getTransportRef: () => WebSocketTransport | null;
  addThread: (target: Sprite | Stage) => void;
  updateThread: (id: string, text: string) => void;
  loadTargetThreads: (target: Sprite | Stage) => void;
  saveThread: (id: string | string[]) => void;
  saveTargetThreads: (target: Sprite | Stage) => void;
  saveAllThreads: () => void;
  deleteThread: (id: string) => void;
  getThread: (id: string) => ThreadState;
  getCodeThreadId: () => string;
  setCodeThreadId: (id: string) => void;
  setCodemirrorRef: (
    id: string,
    ref: React.RefObject<ReactCodeMirrorRef>
  ) => void;
  appendFunction: (id: string, newFunction: string) => void;

  addDiagnostic: (error: VmError) => void;
  pollDiagnostics: () => void;
  clearDiagnostics: () => void;
  clearRuntimeDiagnostics: () => void;
  invalidateDiagnostics: (threadId: string) => void;
  getThreadDiagnostics: (threadId: string) => VmError[];
  formatCode: (threadId: string) => void;
}

export const createCodeEditorSlice: StateCreator<
  EditorState,
  [],
  [],
  CodeEditorState
> = (set, get) => ({
  threads: {},
  codeThreadId: "",
  nextThreadNumber: 0,
  diagnostics: [],
  diagnosticInvalidated: false,
  transportRef: null,

  // Actions
  sendLspState: () => {
    const patchVM = get().patchVM
    const targets = patchVM.getAllRenderedTargets()
    const dynamicOptions: LanguageServerState = {
      targets: Object.keys(targets)
        .filter((targetId: string) => targetId != "Stage")
        .map(targetId => targets[targetId]),
      backdrops: patchVM
        .getTargetForStage()
        .getCostumes(),
      costumes: patchVM.editingTarget?.getCostumes() || [],
      sounds: patchVM.editingTarget?.getSounds() || [],
      messages: patchVM.getAllBroadcastMessages() || [],
      apiData: patchVM.getApiInfo() || [],
    };

    const transport = get().transportRef;
    if (transport) {
      const data = {
        internalID: 1,
        request: {
          jsonrpc: "2.0" as const,
          id: 1,
          method: "workspace/didChangeConfiguration",
          params: {
            settings: dynamicOptions,
          },
        },
      };
      transport.sendData(data);
    } else {
      console.error("WebSocket is not initialized.");
    }
  },
  setTransportRef: (ref) => {
    set({ transportRef: ref })

    const patchVM = get().patchVM

    setTimeout(()=>{
      const targets = patchVM.getAllRenderedTargets()
      const dynamicOptions: LanguageServerState = {
        targets: Object.keys(targets)
          .filter((targetId: string) => targetId != "Stage")
          .map(targetId => targets[targetId]),
        backdrops: patchVM
          .getTargetForStage()
          .getCostumes(),
        costumes: patchVM.editingTarget?.getCostumes() || [],
        sounds: patchVM.editingTarget?.getSounds() || [],
        messages: patchVM.getAllBroadcastMessages() || [],
        apiData: patchVM.getApiInfo() || [],
      };

      const transport = ref;
      if (transport) {
        const data = {
          internalID: 1,
          request: {
            jsonrpc: "2.0" as const,
            id: 1,
            method: "workspace/didChangeConfiguration",
            params: {
              settings: dynamicOptions,
            },
          },
        };
        transport.sendData(data);
      } else {
        console.error("WebSocket is not initialized.");
      }
    },3000)
  },
  getTransportRef: () => get().transportRef,
  setCodemirrorRef: (id: string, ref: React.RefObject<ReactCodeMirrorRef>) =>
    set((state) => {
      state.threads[id].codeMirrorRef = ref;
      return state;
    }),
  appendFunction: (id: string, newFunction: string) =>
    set((state) => {
      console.log(state.threads[id]);
      const codemirrorRef = state.threads[id].codeMirrorRef;
      if (!codemirrorRef || !codemirrorRef.current) return state;

      const view = codemirrorRef.current.view;
      if (!view) return state;

      const selection = view.state.selection.main;
      const pos = selection.from;

      const thread = state.threads[id];
      if (!thread) return state;

      view.dispatch({
        changes: {
          from: pos,
          to: pos,
          insert: newFunction,
        },
        selection: { anchor: pos + newFunction.length },
      });

      return state;
    }),
  addThread: async (target: Sprite | Stage) => {
    const patchVM = get().patchVM;
    const id = await patchVM.addThread(target.id, "", "event_whenflagclicked", "");
    const thread = patchVM.getThread(target.id, id);
    thread.displayName = "Thread " + get().nextThreadNumber;
    set((state) => {
      state.nextThreadNumber++;
      const newThreads = { ...state.threads };
      newThreads[id] = {
        thread,
        text: "",
        saved: true,
        codeMirrorRef: React.createRef<ReactCodeMirrorRef>(),
      };

      const newState = { ...state, threads: newThreads };
      newState.codeThreadId = id;
      return newState;
    });
  },
  updateThread: (id: string, text: string) =>
    set((state) => ({
      threads: {
        ...state.threads,
        [id]: {
          ...state.threads[id],
          text: text,
          saved: false,
          thread: state.threads[id].thread,
        },
      },
    })),
  loadTargetThreads: (target: Sprite | Stage) =>
    set((state) => {
      const patchVM = get().patchVM;
      const newThreads: Dictionary<ThreadState> = {};

      let nextThreadNumber = state.nextThreadNumber;

      const keys = Object.keys(patchVM.getThreadsForTarget(target.id));
      keys.forEach((id) => {
        newThreads[id] = {
          ...state.threads[id],
          thread: patchVM.getThread(target.id, id),
          text: patchVM.getThread(target.id, id).script,
          saved: true,
        };
        if (!newThreads[id].thread.displayName) {
          newThreads[id].thread.displayName = "Thread " + nextThreadNumber;
          nextThreadNumber++;
        }
      });

      const newState = {
        ...state,
        threads: newThreads,
        nextThreadNumber: nextThreadNumber,
      };
      newState.codeThreadId = keys.length > 0 ? patchVM.getThreadsForTarget(target.id)[keys[0]].id : "";
      return newState;
    }),
  saveThread: (id: string | string[]) =>
    set((state) => {
      const ids = typeof id === "string" ? [id] : id;
      const newThreads = { ...state.threads };
      const updatePromises: Promise<any>[] = [];
      ids.forEach((id) => {
        if (!newThreads[id]) {
          return;
        }
        newThreads[id].saved = true;
        updatePromises.push(
          newThreads[id].thread.updateThreadScript(newThreads[id].text)
        );
      });
      Promise.all(updatePromises).then(state.pollDiagnostics);
      return { ...state, threads: newThreads };
    }),
  saveTargetThreads: (target: Sprite | Stage) => {
    const patchVM = get().patchVM;
    
    const editingThreadIds = Object.keys(patchVM.getThreadsForTarget(target.id));

    editingThreadIds.forEach((threadId) => {
      get().saveThread(threadId);
    });
  },
  saveAllThreads: async () => {
    const threads = get().threads;
    const savePromise = Object.keys(threads).map((id) => {
      return threads[id].thread.updateThreadScript(threads[id].text);
    });
    await Promise.all(savePromise);
    get().pollDiagnostics();
    set((state) => {
      const newThreads = { ...state.threads };
      Object.keys(newThreads).forEach((id) => {
        newThreads[id].saved = true;
      });
      return { ...state, threads: newThreads };
    });
  },
  deleteThread: (id: string) =>
    set((state) => {
      const newThreads = { ...state.threads };
      delete newThreads[id];
      get().patchVM.deleteThread(id);

      const newState = { ...state, threads: newThreads };

      const keys = Object.keys(newThreads);
      const oldIndex = Object.keys(state.threads).indexOf(state.codeThreadId);

      newState.codeThreadId =
        keys.length > 0
          ? newThreads[keys[oldIndex > 0 ? oldIndex - 1 : 0]].thread.id
          : "";
      return newState;
    }),
  getThread: (id: string) => get().threads[id],
  getCodeThreadId: () => get().codeThreadId,
  setCodeThreadId: (id: string) =>
    set((state) => {
      return { ...state, codeThreadId: id };
    }),

  addDiagnostic: (error: VmError) =>
    set((state) => {
      const newDiagnostics = [...state.diagnostics];
      newDiagnostics.push({ ...error, fresh: true });
      return { ...state, diagnostics: newDiagnostics };
    }),

  pollDiagnostics: () =>
    set((state) => {
      const runtimeErrors = state.patchVM.getRuntimeErrors();
      const compileTimeErrors = state.patchVM.getCompileTimeErrors();
      const vmErrors: VmError[] = runtimeErrors
        .concat(compileTimeErrors)
        .map((error: VmError) => {
          return { ...error, fresh: true };
        });
      return { ...state, diagnostics: vmErrors, diagnosticInvalidated: false };
    }),
  clearDiagnostics: () =>
    set((state) => {
      return { ...state, diagnostics: [], diagnosticInvalidated: false };
    }),
  clearRuntimeDiagnostics: () =>
    set((state) => {
      return {
        ...state,
        diagnostics: state.diagnostics.filter(
          (error) => error.type !== "RuntimeError"
        ),
      };
    }),
  invalidateDiagnostics: (threadId: string) =>
    set((state) => {
      if (state.diagnosticInvalidated) {
        return state;
      }
      return {
        ...state,
        diagnostics: state.diagnostics.map((diagnostic) => {
          if (diagnostic.threadId == threadId) {
            return { ...diagnostic, fresh: false };
          } else {
            return diagnostic;
          }
        }),
        diagnosticInvalidated: true,
      };
    }),

  getThreadDiagnostics: (threadId: string) => {
    return get().diagnostics.filter((error) => error.threadId === threadId);
  },

  formatCode: (threadId: string) => {   
    const transport = get().transportRef;
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
      .then((event: any[] | null) => {
        if (event != null) {
          const response = JSON.parse(JSON.stringify(event[0]));
          get().updateThread(threadId, response.newText);
          get().setProjectChanged(true);
          get().invalidateDiagnostics(threadId);
        }
      });
    }
  }
});
