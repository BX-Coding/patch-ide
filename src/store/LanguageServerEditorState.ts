import { StateCreator } from 'zustand'
import { EditorState } from './index'
import { Target, Costume,Sound } from '../components/EditorPane/types';

export interface ServerState {
    targets: Target[];
    backdrops: [];
    costumes: Costume[];
    sounds: Sound[];
    messages: [];
}

export interface ServerEditorState {
    serverState: ServerState,

    // Actions
    updateTargets(targets: []): void;
    updateBackdrops(backdrops: []): void;
    updateCostumes(costumes: []): void;
    updateSounds(sounds: []): void;
    updateMessages(messages: []): void;
    updateServerState(): void
}

export const createServerStateSlice: StateCreator<
    EditorState,
    [],
    [],
    ServerEditorState
> = (set, get) => ({
    serverState: {
        targets: [],
        backdrops: [],
        costumes: [],
        sounds: [],
        messages: []
    },

    // Actions
    updateServerState: () => {
        const state = get();
        const serverState = state.serverState;
        state.sendLspState(serverState);
    },
    updateTargets: (targets: Target[]) => {
        set((state) => ({
            serverState: {
                ...state.serverState,
                targets
            }
        }));
        get().updateServerState();
    },
    updateBackdrops: (backdrops: []) => {
        set((state) => ({
            serverState: {
                ...state.serverState,
                backdrops
            }
        }));
        get().updateServerState();
    },
    updateCostumes: (costumes: Costume[]) => {
        set((state) => ({
            serverState: {
                ...state.serverState,
                costumes
            }
        }));
        get().updateServerState();
    },
    updateSounds: (sounds: Sound[]) => {
        set((state) => ({
            serverState: {
                ...state.serverState,
                sounds
            }
        }));
        get().updateServerState();
    },
    updateMessages: (messages: []) => {
        set((state) => ({
            serverState: {
                ...state.serverState,
                messages
            }
        }));
        get().updateServerState();
    },
})