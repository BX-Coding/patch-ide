import { StateCreator } from 'zustand'
import { EditorState } from './index'

export enum EditorTab {
    CODE = "code",
    COSTUMES = "costumes",
    SOUNDS = "sounds",
    VARIABLES = "variables",
}

export enum ModalSelectorType {
    COSTUME = "costume",
    SOUND = "sound",
}

export interface PatchEditorState {
    targetIds: string[],
    editingTargetId: string,

    editorTab: EditorTab,
    vmLoaded: boolean,
    patchReady: boolean,

    projectChanged: boolean,

    modalSelectorType: ModalSelectorType,
    modalSelectorOpen: boolean,

    patchVM: any,

    // Actions
    setTargetIds: (ids: string[]) => void,
    setEditingTargetId: (id: string) => void,

    setEditorTab: (tab: EditorTab) => void,
    setVmLoaded: (loaded: boolean) => void,
    setPatchReady: (ready: boolean) => void,

    setProjectChanged: (changed: boolean) => void,

    showModalSelector: (type: ModalSelectorType) => void,
    hideModalSelector: () => void,

    setPatchVM: any,
}

export const createPatchEditorSlice: StateCreator<
    EditorState,
    [],
    [],
    PatchEditorState
> = (set) => ({
    targetIds: [],
    editingTargetId: "",
    editorTab: EditorTab.CODE,
    vmLoaded: false,
    patchReady: false,
    projectChanged: false,
    modalSelectorType: ModalSelectorType.COSTUME,
    modalSelectorOpen: false,
    patchVM: null,

    // Actions
    setTargetIds: (ids: string[]) => set({ targetIds: ids }),
    setEditingTargetId: (id: string) => set({ editingTargetId: id }),

    setEditorTab: (tab: EditorTab) => set({ editorTab: tab }),
    setVmLoaded: (loaded: boolean) => set({ vmLoaded: loaded }),
    setPatchReady: (ready: boolean) => set({ patchReady: ready }),

    setProjectChanged: (changed: boolean) => set({ projectChanged: changed }),

    showModalSelector: (type: ModalSelectorType) => set({ modalSelectorType: type, modalSelectorOpen: true }),
    hideModalSelector: () => set({ modalSelectorOpen: false }),

    setPatchVM: (vm: any) => set({ patchVM: vm }),
})