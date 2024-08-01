import { StateCreator } from 'zustand';
import { EditorState } from './index';
// import { Costume, Sprite, Stage } from 'leopard';
import { Costume, Sprite, Stage } from '../../vm/src';

export interface CostumeEditorState {
    costumes: Costume[],
    selectedCostumeIndex: number,

    // Actions
    setCostumes: (costumes: Costume[]) => void,
    addCostume: (md5ext: string, costume: Costume, targetId: string) => void,
    setSelectedCostumeIndex: (index: number) => void,
    loadTargetCostumes: (target: Sprite | Stage) => void,
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
        set({ costumes: [...(editingTarget?.getCostumes() || [])] });
    },
    setSelectedCostumeIndex: (index: number) => set({ selectedCostumeIndex: index }),
    loadTargetCostumes: (target: Sprite | Stage) => set({ costumes: target.getCostumes(), selectedCostumeIndex: target.costumeNumber - 1 }),
})