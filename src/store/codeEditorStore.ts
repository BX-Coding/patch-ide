import { StateCreator } from 'zustand'
import { EditorState } from './index'
import { Target, Thread } from '../components/EditorPane/types';

type ThreadState = {
    thread: Thread,
    text: string,
    saved: boolean,
}

export interface CodeEditorState {
    threads: { [key: string]: ThreadState };
    codeThreadId: string;
    nextThreadNumber: number;

    // Actions
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

    // Actions
    addThread: async (target: Target) => {
        const id = await target.addThread("", "event_whenflagclicked", "");
        const thread = target.getThread(id);
        thread.displayName = "Thread " + get().nextThreadNumber;
        set((state) => {
            state.nextThreadNumber++;
            const newThreads = { ...state.threads };
            newThreads[id] = { thread, text: "", saved: true };

            const newState = { ...state, threads: newThreads };
            newState.codeThreadId = id;
            return newState;
        }
        )
    },
    updateThread: (id: string, text: string) => set((state) => ({ threads: { ...state.threads, [id]: { text: text, saved: false, thread: state.threads[id].thread } } })),
    loadTargetThreads: (target: Target) => set((state) => {
        const newThreads: { [key: string]: ThreadState } = {};

        let nextThreadNumber = state.nextThreadNumber;

        const keys = Object.keys(target.threads);
        keys.forEach((id) => {
            newThreads[id] = { thread: target.getThread(id), text: target.getThread(id).script, saved: true };
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
        ids.forEach((id) => {
            if (!newThreads[id]) {
                return;
            }
            newThreads[id].saved = true;
            newThreads[id].thread.updateThreadScript(newThreads[id].text);
        });
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

})