import { StateCreator } from "zustand";
import { EditorState } from "./index";
import { Sprite, Stage, Sound } from "leopard";
import { Costume } from "leopard";
import { Dictionary } from "../engine/interfaces";

export interface LanguageServerState {
  targets: (Sprite | Stage)[];
  backdrops: Costume[];
  costumes: Costume[];
  sounds: Sound[];
  messages: string[];
  apiData: Dictionary<any>;
}

export interface ServerEditorState {
  languageServerState: LanguageServerState;

  // Actions
  updateTargets(targets: []): void;
  updateBackdrops(backdrops: []): void;
  updateCostumes(costumes: []): void;
  updateSounds(sounds: []): void;
  updateMessages(messages: []): void;
  updateLanguageServerState(): void;
}

export const createServerStateSlice: StateCreator<
  EditorState,
  [],
  [],
  ServerEditorState
> = (set, get) => ({
  languageServerState: {
    targets: [],
    backdrops: [],
    costumes: [],
    sounds: [],
    messages: [],
    apiData: [],
  },

  // Actions
  updateLanguageServerState: () => {
    const state = get();
    const serverState = state.languageServerState;
    // state.sendLspState(serverState);
  },
  updateTargets: (targets: (Sprite | Stage)[]) => {
    set((state) => ({
      languageServerState: {
        ...state.languageServerState,
        targets,
      },
    }));
    get().updateLanguageServerState();
  },
  updateBackdrops: (backdrops: Costume[]) => {
    set((state) => ({
      languageServerState: {
        ...state.languageServerState,
        backdrops,
      },
    }));
    get().updateLanguageServerState();
  },
  updateCostumes: (costumes: Costume[]) => {
    set((state) => ({
      languageServerState: {
        ...state.languageServerState,
        costumes,
      },
    }));
    get().updateLanguageServerState();
  },
  updateSounds: (sounds: Sound[]) => {
    set((state) => ({
      languageServerState: {
        ...state.languageServerState,
        sounds,
      },
    }));
    get().updateLanguageServerState();
  },
  updateMessages: (messages: []) => {
    set((state) => ({
      languageServerState: {
        ...state.languageServerState,
        messages,
      },
    }));
    get().updateLanguageServerState();
  },
});
