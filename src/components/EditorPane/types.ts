export interface Thread {
    status: number,
    id: string,
    blockUtility: any,
    script: string,
    triggerEvent: string,
    triggerEventOption: string,
    loadPromise: Promise<boolean>,
    interruptThread: boolean,
    running: boolean,
    displayName: string,

    updateThreadScript: (script: string) => Promise<void>,
    updateThreadTriggerEvent: (trigger: string) => void,
    updateThreadTriggerEventOption: (option: string) => void,
}

export interface VmState {

}

export type PatchProject = VmState & {
    name: string,
    lastEdited: Date,
    owner: string,
}

export type VmError = { 
    threadId: string, 
    message: string, 
    lineNumber: number, 
    type: VmErrorType,
    fresh: boolean,
}

export type VmErrorType = "CompileTimeError" | "RuntimeError"