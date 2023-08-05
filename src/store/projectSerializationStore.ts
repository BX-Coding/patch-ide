import { StateCreator } from 'zustand'
import { EditorState } from './index'
import { DOMElement } from 'react'
import { b64dataurltoBlob, downloadProject, hasLocalStorageProject, loadFromLocalStorage, loadSerializedProject, saveToLocalStorage } from '../util/patch-serialization'

export interface ProjectSerializationState {
    downloadProject: () => void,
    loadSerializedProject: (vmState: Blob | string | ArrayBuffer) => void,
    saveToLocalStorage: () => void,
    b64dataurltoBlob: (dataurl: string, contentType?: string, sliceSize?: number) => void,
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
    loadSerializedProject: async (vmState: Blob | string | ArrayBuffer) => {
        await loadSerializedProject(vmState, get());
    },
    saveToLocalStorage: async () => {
        await saveToLocalStorage(get());
    },
    b64dataurltoBlob: (dataurl: string, contentType?: string, sliceSize?: number) => {
        b64dataurltoBlob(dataurl, contentType, sliceSize);
    },
    hasLocalStorageProject: () => {
        return hasLocalStorageProject();
    },
    loadFromLocalStorage: async () => {
        await loadFromLocalStorage(get());
    }
})