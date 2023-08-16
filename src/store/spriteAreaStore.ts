import { StateCreator } from 'zustand'
import { EditorState } from './index'

export interface SpriteAreaState {
    questionAsked: string | null,
    runButtonDisabled: boolean,

    editingTargetX: number,
    editingTargetY: number,
    editingTargetSize: number,
    editingTargetDirection: number, 

    // Actions
    setQuestionAsked: (asked: string | null) => void,
    setRunButtonDisabled: (disabled: boolean) => void,

    setEditingTargetAttributes: (x: number, y: number, size: number, direction: number) => void,
}

export const createSpriteAreaSlice: StateCreator<
    EditorState,
    [],
    [],
    SpriteAreaState
> = (set) => ({
    questionAsked: null,
    runButtonDisabled: false,

    editingTargetX: 0,
    editingTargetY: 0,
    editingTargetSize: 0,
    editingTargetDirection: 0,

    // Actions
    setQuestionAsked: (asked: string | null) => set({ questionAsked: asked }),
    setRunButtonDisabled: (disabled: boolean) => set({ runButtonDisabled: disabled }),

    setEditingTargetAttributes: (x: number, y: number, size: number, direction: number) => set({
        editingTargetX: x,
        editingTargetY: y,
        editingTargetSize: size,
        editingTargetDirection: direction,
    }),

  })