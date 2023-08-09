import { StateCreator } from 'zustand'
import { EditorState } from './index'

export type GlobalVariable = {
    name: string,
    value: string | number | boolean,
}

export interface VariableEditorState {
    globalVariables: GlobalVariable[],

    newVariableName: string,
    newVariableValue: string | number | boolean,

    // Actions
    setGlobalVariable: (name: string, value: string | number | boolean) => void,
    setGlobalVariables: (variables: GlobalVariable[]) => void,
    deleteGlobalVariable: (name: string) => void,
    getGlobalVariable: (name: string) => string | number | boolean,

    setNewVariableName: (name: string) => void,
    setNewVariableValue: (value: string | number | boolean) => void,
}

export const createVariableEditorSlice: StateCreator<
    EditorState,
    [],
    [],
    VariableEditorState
> = (set, get) => ({
    globalVariables: [],
    newVariableName: "",
    newVariableValue: "",

    // Actions
    setGlobalVariable: (name: string, value: string | number | boolean) => set((state) => {
        console.warn("Setting global variable " + name + " to " + value);
        
        const newGlobalVariables = [ ...state.globalVariables ];
        const foundVariable = newGlobalVariables.find((variable) => variable.name === name);
        if (foundVariable) {
            foundVariable.value = value;
        } else {
            newGlobalVariables.push({ name: name, value: value });
        }
        return { globalVariables: newGlobalVariables };
    }),
    setGlobalVariables: (variables: GlobalVariable[]) => set((state) => {
        const newGlobalVariables = [ ...state.globalVariables ];
        variables.forEach((variable) => {
            get().setGlobalVariable(variable.name, variable.value);
        });
        
        return { globalVariables: newGlobalVariables };
    }),
    deleteGlobalVariable: (name: string) => set((state) => {
        const newGlobalVariables = [ ...state.globalVariables ];
        const foundVariableIndex = newGlobalVariables.findIndex((variable) => variable.name === name);
        if (foundVariableIndex !== -1) {
            newGlobalVariables.splice(foundVariableIndex, 1);
        }
        return { globalVariables: newGlobalVariables };
    }
    ),
    getGlobalVariable: (name: string) => {
        const foundVariable = get().globalVariables.find((variable) => variable.name === name);
        if (foundVariable) {
            return foundVariable.value;
        } else {
            return "";
        }
    },
    setNewVariableName: (name: string) => set({ newVariableName: name }),
    setNewVariableValue: (value: string | number | boolean) => set({ newVariableValue: value }),
})