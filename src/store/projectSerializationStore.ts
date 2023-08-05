import { StateCreator } from 'zustand'
import { EditorState } from './index'
import { DOMElement } from 'react'
import { downloadProject } from '../util/patch-serialization'

export interface ProjectSerializationState {
    downloadProject: () => void,
    initializeThreadGlobalState: () => void,
    loadSerializedProject: (vmState: Blob | string | ArrayBuffer) => void,
    saveToLocalStorage: () => void,
    b64dataurltoBlob: (dataurl: string, contentType?: string, sliceSize?: number) => Blob,
    hasLocalStorageProject: () => boolean,
    loadFromLocalStorage: () => void,
}

export const createProjectSerializationSlice: StateCreator<
    EditorState,
    [],
    [],
    ProjectSerializationState
> = (set, get) => ({
    downloadProject: async () => {
        await downloadProject(get().patchVM);
    },
    initializeThreadGlobalState: async () => {
        initializeThreadGlobalState(get().patchVM, get().loadTargetThreads, get().saveAllThreads);
    },
    
})