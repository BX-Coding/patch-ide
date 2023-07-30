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

    setEditingTargetX: (x: number) => void,
    setEditingTargetY: (y: number) => void,
    setEditingTargetSize: (size: number) => void,
    setEditingTargetDirection: (direction: number) => void,
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

    setEditingTargetX: (x: number) => set({ editingTargetX: x }),
    setEditingTargetY: (y: number) => set({ editingTargetY: y }),
    setEditingTargetSize: (size: number) => set({ editingTargetSize: size }),
    setEditingTargetDirection: (direction: number) => set({ editingTargetDirection: direction }),

  })