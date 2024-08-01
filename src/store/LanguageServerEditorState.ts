import { StateCreator } from "zustand";
import { EditorState } from "./index";
// import { Sprite, Stage, Sound } from "leopard";
// import { Costume } from "leopard";
import { Sprite, Stage, Sound, Costume } from "../../vm/src";
import { Dictionary } from "../engine/interfaces";

export interface LanguageServerState {
  targets: String[];
  backdrops: [];
  costumes: Costume[];
  sounds: Sound[];
  messages: [];
  apiData: Dictionary<any>;
}

export interface ServerEditorState {
  languageServerState: LanguageServerState;
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
    state.sendLspState();
  },
});
