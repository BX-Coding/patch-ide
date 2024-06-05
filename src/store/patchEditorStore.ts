import { StateCreator } from 'zustand'
import { EditorState } from './index'
import { DOMElement } from 'react'
import { DocumentData, DocumentReference } from 'firebase/firestore'

export enum EditorTab {
    CODE = "code",
    COSTUMES = "costumes",
    SOUNDS = "sounds",
    VARIABLES = "variables",
}

export enum ModalSelectorType {
    SPRITE = "sprite",
    BACKDROP = "backdrop",
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
    projectReference: DocumentReference<DocumentData, DocumentData> | null,

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

    setProjectReference: (ref: DocumentReference<DocumentData, DocumentData>) => void,
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
    projectReference: null,


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

    setProjectReference: (ref: DocumentReference<DocumentData, DocumentData>) => set({ projectReference: ref }),
})