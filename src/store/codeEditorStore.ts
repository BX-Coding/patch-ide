import { StateCreator } from 'zustand'
import { EditorState } from './index'

type ThreadState = {
    text: string,
    saved: boolean,
}

export interface CodeEditorState {
    threads: { [key: string]: ThreadState};

    // Actions
    addThread: (id: string, text: string) => void,
    updateThread: (id: string, text: string) => void,
    saveThread: (id: string) => void,
    deleteThread: (id: string) => void,
}

export const createCodeEditorSlice: StateCreator<
    EditorState,
    [],
    [],
    CodeEditorState
> = (set) => ({
    threads: {},

    // Actions
    addThread: (id: string, text: string) => set((state) => ({ threads: { ...state.threads, [id]: { text: text, saved: false } } })),
    updateThread: (id: string, text: string) => set((state) => ({ threads: { ...state.threads, [id]: { text: text, saved: false } } })),
    saveThread: (id: string) => set((state) => ({ threads: { ...state.threads, [id]: { ...state.threads[id], saved: true } } })),
    deleteThread: (id: string) => set((state) => {
        const newThreads = { ...state.threads };
        delete newThreads[id];
        return { threads: newThreads };
    }),
    
})