import { create } from 'zustand'
import { CodeEditorState, createCodeEditorSlice } from './codeEditorStore'
import { CostumeEditorState, createCostumeEditorSlice } from './costumeEditorStore'
import { SoundEditorState, createSoundEditorSlice } from './soundEditorStore'
import { SpriteAreaState, createSpriteAreaSlice } from './spriteAreaStore'
import { VariableEditorState, createVariableEditorSlice } from './variableEditorStore'
import { EditorTab, ModalSelectorType, PatchEditorState, createPatchEditorSlice } from './patchEditorStore'

export interface EditorState extends 
    CodeEditorState, 
    CostumeEditorState, 
    SoundEditorState, 
    SpriteAreaState, 
    VariableEditorState, 
    PatchEditorState {}

const usePatchStore = create<EditorState>()((...params) => ({
    ...createCodeEditorSlice(...params),
    ...createCostumeEditorSlice(...params),
    ...createSoundEditorSlice(...params),
    ...createSpriteAreaSlice(...params),
    ...createVariableEditorSlice(...params),
    ...createPatchEditorSlice(...params),
}))

export { EditorTab, ModalSelectorType }; 

export default usePatchStore;