import { StateCreator } from 'zustand'
import { EditorState } from './index'
import { DOMElement } from 'react'

export enum EditorTab {
    CODE = "code",
    COSTUMES = "costumes",
    SOUNDS = "sounds",
    VARIABLES = "variables",
}

export enum ModalSelectorType {
    SPRITE = "sprite",
    COSTUME = "costume",
    SOUND = "sound",
}

type Stage = {
    canvas: HTMLCanvasElement,
    height: number,
    width: number,
}

export interface PatchEditorState {
    targetIds: string[],
    editingTargetId: string,

    editorTab: EditorTab,
    vmLoaded: boolean,
    patchReady: boolean,
    renderEditor: boolean,

    projectChanged: boolean,

    modalSelectorType: ModalSelectorType,
    modalSelectorOpen: boolean,

    isNewProject: boolean,
    projectName: string,

    saveProject: (uid: string, name: string, createNewProject: boolean) => void,

    patchVM: any,
    patchStage: Stage,

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
    setPatchStage: (stage: Stage) => void,
    
    setNewProject: (isNew: boolean) => void,
    setProjectName: (name: string) => void,

    setSaveProject: (save: (uid: string, name: string, createNewProject: boolean) => void) => void,
}

export const createPatchEditorSlice: StateCreator<
    EditorState,
    [],
    [],
    PatchEditorState
> = (set, get) => ({
    targetIds: [],
    editingTargetId: "",
    editorTab: EditorTab.CODE,
    vmLoaded: false,
    patchReady: false,
    renderEditor: false,
    projectChanged: false,
    modalSelectorType: ModalSelectorType.COSTUME,
    modalSelectorOpen: false,
    patchVM: null,
    patchStage: {
        canvas: document.createElement('canvas'),
        height: 400,
        width: 600,
    },
    isNewProject: false,
    projectName: "",
    saveProject: () => null,

    // Actions
    setTargetIds: (ids: string[]) => set({ targetIds: ids }),
    setEditingTargetId: (id: string) => set({ editingTargetId: id }),

    setEditorTab: (tab: EditorTab) => set({ editorTab: tab }),
    setVmLoaded: (loaded: boolean) => set({ vmLoaded: loaded, renderEditor: loaded && get().patchReady }),
    setPatchReady: (ready: boolean) => set({ patchReady: ready, renderEditor: ready && get().vmLoaded }),

    setProjectChanged: (changed: boolean) => set({ projectChanged: changed }),

    showModalSelector: (type: ModalSelectorType) => set({ modalSelectorType: type, modalSelectorOpen: true }),
    hideModalSelector: () => set({ modalSelectorOpen: false }),

    setPatchVM: (vm: any) => set({ patchVM: vm }),
    setPatchStage: (stage: Stage) => set({ patchStage: stage }),
    
    setNewProject: (isNew: boolean) => set({ isNewProject: isNew }),
    setProjectName: (name: string) => set({ projectName: name }),

    setSaveProject: (save) => set({ saveProject: save })
})