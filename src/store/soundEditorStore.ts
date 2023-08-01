import { StateCreator } from 'zustand'
import { EditorState } from './index'

type Asset = {
    data: number[]
    assetId: string,
    assetType: string,
}

type Sound = {
    rate: number
    name: string,
    asset: Asset,
}

export interface SoundEditorState {
    sounds: Sound[],
    selectedSoundIndex: number,
    context: AudioContext | undefined,
    buf: AudioBuffer | null,

    // Actions
    setSounds: (sounds: Sound[]) => void,
    setSelectedSoundIndex: (index: number) => void,
    setContext: (context: AudioContext) => void,
    setBuf: (buf: AudioBuffer) => void,
}

export const initAudioContext = () => {
    if (!window.AudioContext) {
        // @ts-ignore
        if (!window.webkitAudioContext) {
            alert("Your browser does not support any AudioContext and cannot play back this audio.");
            return;
        }
        // @ts-ignore
        window.AudioContext = window.webkitAudioContext;
    }

    return new AudioContext();
}

export const createSoundEditorSlice: StateCreator<
    EditorState,
    [],
    [],
    SoundEditorState
> = (set) => ({
    sounds: [],
    selectedSoundIndex: -1,
    context: initAudioContext(),
    buf: null,

    // Actions
    setSounds: (sounds: Sound[]) => set({ sounds: sounds }),
    setSelectedSoundIndex: (index: number) => set({ selectedSoundIndex: index }),
    setContext: (context: AudioContext) => set({ context: context }),
    setBuf: (buf: AudioBuffer) => set({ buf: buf }),
})