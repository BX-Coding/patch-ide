import { RuntimeState } from "../../engine/runtime"

export type PatchProject = RuntimeState & {
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