import { StateCreator } from 'zustand'
import { EditorState } from './index'

type Asset = {
    assetId: string,
    assetType: string,
}

type Sound = {
    name: string,
    asset: Asset,
}

export interface SoundEditorState {
    sounds: Sound[],
    selectedSoundIndex: number,

    // Actions
    setSounds: (sounds: Sound[]) => void,
    setSelectedSoundIndex: (index: number) => void,
}

export const createSoundEditorSlice: StateCreator<
    EditorState,
    [],
    [],
    SoundEditorState
> = (set) => ({
    sounds: [],
    selectedSoundIndex: -1,

    // Actions
    setSounds: (sounds: Sound[]) => set({ sounds: sounds }),
    setSelectedSoundIndex: (index: number) => set({ selectedSoundIndex: index }),
})