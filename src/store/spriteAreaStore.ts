import { StateCreator } from 'zustand'
import { EditorState } from './index'

export interface SpriteAreaState {
    questionAsked: boolean,
    runButtonDisabled: boolean,

    editingTargetX: number,
    editingTargetY: number,
    editingTargetSize: number,
    editingTargetDirection: number, 

    // Actions
    setQuestionAsked: (asked: boolean) => void,
    setRunButtonDisabled: (disabled: boolean) => void,

    setEditingTargetAttributes: (x: number, y: number, size: number, direction: number) => void,
}

export const createSpriteAreaSlice: StateCreator<
    EditorState,
    [],
    [],
    SpriteAreaState
> = (set) => ({
    questionAsked: false,
    runButtonDisabled: false,

    editingTargetX: 0,
    editingTargetY: 0,
    editingTargetSize: 0,
    editingTargetDirection: 0,

    // Actions
    setQuestionAsked: (asked: boolean) => set({ questionAsked: asked }),
    setRunButtonDisabled: (disabled: boolean) => set({ runButtonDisabled: disabled }),

    setEditingTargetAttributes: (x: number, y: number, size: number, direction: number) => set({
        editingTargetX: x,
        editingTargetY: y,
        editingTargetSize: size,
        editingTargetDirection: direction,
    }),

  })