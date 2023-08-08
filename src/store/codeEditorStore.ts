import { StateCreator } from 'zustand'
import { EditorState } from './index'
import { Target, Thread } from '../components/EditorPane/types';

type ThreadState = {
    thread: Thread,
    text: string,
    saved: boolean,
}

export interface CodeEditorState {
    threads: { [key: string]: ThreadState};

    // Actions
    addThread: (target: Target) => void,
    updateThread: (id: string, text: string) => void,
    loadTargetThreads: (target: Target) => void,
    saveThread: (id: string | string[]) => void,
    saveTargetThreads: (target: Target) => void,
    saveAllThreads: () => void,
    deleteThread: (id: string) => void,
    getThread: (id: string) => ThreadState,
}

export const createCodeEditorSlice: StateCreator<
    EditorState,
    [],
    [],
    CodeEditorState
> = (set, get) => ({
    threads: {},

    // Actions
    addThread: async (target: Target) => {
        const id = await target.addThread("", "event_whenflagclicked", "");
        const thread = target.getThread(id);
        set((state) => {
            const newThreads = { ...state.threads };
            newThreads[id] = { thread, text: "", saved: true };
            return { threads: newThreads };
        }
    )},
    updateThread: (id: string, text: string) => set((state) => ({ threads: { ...state.threads, [id]: { text: text, saved: false, thread: state.threads[id].thread } } })),
    loadTargetThreads: (target: Target) => set((state) => {
        const newThreads: { [key: string]: ThreadState} = {};
        Object.keys(target.threads).forEach((id) => {
            newThreads[id] = { thread: target.getThread(id), text: target.getThread(id).script, saved: true };
        });
        return { threads: newThreads };
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
        return { threads: newThreads };
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
            return { threads: newThreads };
        }
        )},
    deleteThread: (id: string) => set((state) => {
        const newThreads = { ...state.threads };
        delete newThreads[id];
        get().patchVM.deleteThread(id);
        return { threads: newThreads };
    }),
    getThread: (id: string) => get().threads[id],
    
})