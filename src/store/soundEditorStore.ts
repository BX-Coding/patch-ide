import { StateCreator } from 'zustand'
import { EditorState } from './index'
import { Sound, SoundJson, Target } from '../components/EditorPane/types'

type Asset = {
    data: number[]
    assetId: string,
    assetType: string,
}

export interface SoundEditorState {
    sounds: Sound[],
    selectedSoundIndex: number,
    context: AudioContext | undefined,
    buf: AudioBuffer | null,

    // Actions
    addSound: (sound: Sound | SoundJson | any, targetId?: string) => void,
    setSounds: (sounds: Sound[]) => void,
    setSelectedSoundIndex: (index: number) => void,
    loadTargetSounds: (target: Target) => void,

    // Preview Actions
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
> = (set, get) => ({
    sounds: [],
    selectedSoundIndex: -1,
    context: initAudioContext(),
    buf: null,

    // Actions
    addSound: async (sound: Sound | SoundJson | any, targetId?: string) => {
        await get().patchVM.addSound(sound, targetId);
        const editingTarget = get().patchVM.editingTarget;
        set({ sounds: [...editingTarget.sprite.sounds]  });
    },
    setSounds: (sounds: Sound[]) => set({ sounds: sounds }),
    setSelectedSoundIndex: (index: number) => set({ selectedSoundIndex: index }),
    loadTargetSounds: (target: Target) => set({ sounds: [...target.sprite.sounds], selectedSoundIndex: 0 }),

    // Preview Actions
    setContext: (context: AudioContext) => set({ context: context }),
    setBuf: (buf: AudioBuffer) => set({ buf: buf }),
})