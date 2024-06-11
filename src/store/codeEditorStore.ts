import { StateCreator } from 'zustand'
import { EditorState } from './index'
import { Target, Thread, VmError } from '../components/EditorPane/types';
import { ReactCodeMirrorRef } from '@uiw/react-codemirror';
import React from 'react';
import { Transport } from "@open-rpc/client-js/build/transports/Transport";
import { WebSocketTransport } from "@open-rpc/client-js";
import { JSONRPCRequestData } from "@open-rpc/client-js/build/Request";
import { ServerState } from './LanguageServerEditorState';

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
  
export const createWSTransport = once((serverUri: string) => {
    return new LazyWebsocketTransport(serverUri);
});

class LazyWebsocketTransport extends Transport {
    private delegate: WebSocketTransport | undefined;
    private serverUri: string;
  
    constructor(serverUri: string) {
      super();
      this.delegate = undefined;
      this.serverUri = serverUri;
    }
  
    override async connect() {
      this.delegate = new WebSocketTransport(this.serverUri);
      return this.delegate.connect();
    }
  
    override close() {
      this.delegate?.close();
    }
  
    override async sendData(
      data: JSONRPCRequestData,
      timeout?: number | null | undefined
    ) {
      return this.delegate?.sendData(data, timeout);
    }
}

type ThreadState = {
    thread: Thread,
    text: string,
    saved: boolean,
    codeMirrorRef : React.RefObject<ReactCodeMirrorRef> | null
}

export interface CodeEditorState {
    threads: { [key: string]: ThreadState };
    codeThreadId: string;
    nextThreadNumber: number;
    diagnostics: VmError[];
    diagnosticInvalidated: boolean;
    transportRef: LazyWebsocketTransport | null;

    // Actions
    sendLspState: (request: ServerState) => void;
    setTransportRef: (ref:  LazyWebsocketTransport) => void;
    getTransportRef: () => LazyWebsocketTransport | null;
    addThread: (target: Target) => void,
    updateThread: (id: string, text: string) => void,
    loadTargetThreads: (target: Target) => void,
    saveThread: (id: string | string[]) => void,
    saveTargetThreads: (target: Target) => void,
    saveAllThreads: () => void,
    deleteThread: (id: string) => void,
    getThread: (id: string) => ThreadState,
    getCodeThreadId: () => string,
    setCodeThreadId: (id: string) => void,
    setCodemirrorRef: (id:string,ref: React.RefObject<ReactCodeMirrorRef>) => void;
    appendFunction: (id: string, newFunction: string) => void;

    addDiagnostic: (error: VmError) => void,
    pollDiagnostics: () => void,
    clearDiagnostics: () => void,
    clearRuntimeDiagnostics: () => void,
    invalidateDiagnostics: (threadId: string) => void,
    getThreadDiagnostics: (threadId: string) => VmError[],
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
    sendLspState: (state: ServerState) => {
      const transport = get().transportRef;
      if (transport) {
          const data = {
                internalID: 1,
                request: {
                    jsonrpc: "2.0" as const,
                    id: 1,
                    method: "workspace/didChangeConfiguration",
                    params: {
                      settings: state,
                    },
                }
            };
          transport.sendData(data);
      } else {
        console.error("WebSocket is not initialized.");
      }
    },
    setTransportRef: (ref) => set({ transportRef: ref }),
    getTransportRef: () => get().transportRef,
    setCodemirrorRef: (id : string, ref: React.RefObject<ReactCodeMirrorRef>) =>
      set((state) => {
        state.threads[id].codeMirrorRef = ref
        return state
      }),
    appendFunction: (id: string, newFunction: string) =>
      set((state) => {
        console.log(state.threads[id])
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
    
        return state
      }),
    addThread: async (target: Target) => {
        const id = await target.addThread("", "event_whenflagclicked", "");
        const thread = target.getThread(id);
        thread.displayName = "Thread " + get().nextThreadNumber;
        set((state) => {
            state.nextThreadNumber++;
            const newThreads = { ...state.threads };
            newThreads[id] = { thread, text: "", saved: true, codeMirrorRef: React.createRef<ReactCodeMirrorRef>() };

            const newState = { ...state, threads: newThreads };
            newState.codeThreadId = id;
            return newState;
        }
        )
    },
    updateThread: (id: string, text: string) => set((state) => ({ threads: { ...state.threads, [id]: { ...state.threads[id], text: text, saved: false, thread: state.threads[id].thread } } })),
    loadTargetThreads: (target: Target) => set((state) => {
        const newThreads: { [key: string]: ThreadState } = {};

        let nextThreadNumber = state.nextThreadNumber;

        const keys = Object.keys(target.threads);
        keys.forEach((id) => {
            newThreads[id] = {...state.threads[id], thread: target.getThread(id), text: target.getThread(id).script, saved: true };
            if (!newThreads[id].thread.displayName) {
                newThreads[id].thread.displayName = "Thread " + nextThreadNumber;
                nextThreadNumber++;
            }
        });

        const newState = { ...state, threads: newThreads, nextThreadNumber: nextThreadNumber };
        newState.codeThreadId = (keys.length > 0) ? target.threads[keys[0]].id : "";
        return newState;
    }),
    saveThread: (id: string | string[]) => set((state) => {
        const ids = typeof id === "string" ? [id] : id;
        const newThreads = { ...state.threads };
        const updatePromises:Promise<any>[] = [];
        ids.forEach((id) => {
            if (!newThreads[id]) {
                return;
            }
            newThreads[id].saved = true;
            updatePromises.push(newThreads[id].thread.updateThreadScript(newThreads[id].text));
        });
        Promise.all(updatePromises).then(state.pollDiagnostics);
        return { ...state, threads: newThreads };
    }),
    saveTargetThreads: (target: Target) => {
        const editingThreadIds = Object.keys(target.threads);

        editingThreadIds.forEach(threadId => {
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
        }
        )
    },
    deleteThread: (id: string) => set((state) => {
        const newThreads = { ...state.threads };
        delete newThreads[id];
        get().patchVM.deleteThread(id);

        const newState = { ...state, threads: newThreads };

        const keys = Object.keys(newThreads);
        const oldIndex = Object.keys(state.threads).indexOf(state.codeThreadId);

        newState.codeThreadId = keys.length > 0 ? newThreads[keys[(oldIndex > 0) ? oldIndex - 1 : 0]].thread.id : "";
        return newState;
    }),
    getThread: (id: string) => get().threads[id],
    getCodeThreadId: () => get().codeThreadId,
    setCodeThreadId: (id: string) => set((state) => {
        return { ...state, codeThreadId: id };
    }),

    addDiagnostic: (error: VmError) => set((state) => {
        const newDiagnostics = [...state.diagnostics];
        newDiagnostics.push({ ...error, fresh: true });
        return { ...state, diagnostics: newDiagnostics };
    }),

    pollDiagnostics: () => set((state) => {
        const runtimeErrors = state.patchVM.getRuntimeErrors();
        const compileTimeErrors = state.patchVM.getCompileTimeErrors();
        const vmErrors: VmError[] = runtimeErrors.concat(compileTimeErrors).map((error: VmError) => {
            return { ...error, fresh: true };
        });
        return { ...state, diagnostics: vmErrors, diagnosticInvalidated: false };
    }),
    clearDiagnostics: () => set((state) => {
        return { ...state, diagnostics: [], diagnosticInvalidated: false };
    }),
    clearRuntimeDiagnostics: () => set((state) => {
        return { ...state, diagnostics: state.diagnostics.filter((error) => error.type !== "RuntimeError")};
    }),
    invalidateDiagnostics: (threadId: string) => set((state) => {
        if (state.diagnosticInvalidated) {
            return state;
        }
        return { ...state, diagnostics: state.diagnostics.map((diagnostic) => {
            if (diagnostic.threadId == threadId) {
                return { ...diagnostic, fresh: false } 
            } else {
                return diagnostic;
            
            }
            }), diagnosticInvalidated: true };
    }),

    getThreadDiagnostics: (threadId: string) => {
        return get().diagnostics.filter((error) => error.threadId === threadId);
    },

})