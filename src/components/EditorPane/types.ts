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