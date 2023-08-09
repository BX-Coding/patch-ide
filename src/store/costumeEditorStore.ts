import { StateCreator } from 'zustand';
import { EditorState } from './index';
import { Costume, Target } from '../components/EditorPane/types';

export interface CostumeEditorState {
    costumes: Costume[],
    selectedCostumeIndex: number,

    // Actions
    setCostumes: (costumes: Costume[]) => void,
    addCostume: (md5ext: string, costume: Costume, targetId: string) => void,
    setSelectedCostumeIndex: (index: number) => void,
    loadTargetCostumes: (target: Target) => void,
}

export const createCostumeEditorSlice: StateCreator<
    EditorState,
    [],
    [],
    CostumeEditorState
> = (set, get) => ({
    costumes: [],
    selectedCostumeIndex: -1,

    // Actions
    setCostumes: (costumes: Costume[]) => set({ costumes: costumes }),
    addCostume: async (md5ext: string, costume: Costume, targetId: string) => {
        await get().patchVM.addCostume(md5ext, costume, targetId);
        const editingTarget = get().patchVM.editingTarget;
        set({ costumes: [...editingTarget.sprite.costumes]  });
    },
    setSelectedCostumeIndex: (index: number) => set({ selectedCostumeIndex: index }),
    loadTargetCostumes: (target: Target) => set({ costumes: target.sprite.costumes, selectedCostumeIndex: target.currentCostume }),
})