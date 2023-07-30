import { StateCreator } from 'zustand'
import { EditorState } from './index'

export interface VariableEditorState {
    globalVariables: { [key: string]: string | number | boolean },

    // Actions
    setGlobalVariable: (name: string, value: string | number | boolean) => void,
    deleteGlobalVariable: (name: string) => void,
    getGlobalVariable: (name: string) => string | number | boolean,
}

export const createVariableEditorSlice: StateCreator<
    EditorState,
    [],
    [],
    VariableEditorState
> = (set, get) => ({
    globalVariables: {},

    // Actions
    setGlobalVariable: (name: string, value: string | number | boolean) => set((state) => ({ globalVariables: { ...state.globalVariables, [name]: value } })),
    deleteGlobalVariable: (name: string) => set((state) => {
        const newGlobalVariables = { ...state.globalVariables };
        delete newGlobalVariables[name];
        return { globalVariables: newGlobalVariables };
    }
    ),
    getGlobalVariable: (name: string) => {
        return get().globalVariables[name];
    }
})