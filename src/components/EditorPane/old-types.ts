import EventEmitter from "events"
import { Dictionary } from "../../engine/interfaces"

export enum DataFormat {
    SVG = "svg",
    PNG = "png",
    WAV = "wav",
    JSON = "json",
}

export type AssetType = {
    contentType: string,
    name: string,
    runtimeFormat: DataFormat,
    immutable: boolean,
}

export type Asset = {
    assetId: string,
    assetType: AssetType,
    data: any,
    dataFormat: string,
    clean?: boolean,
}

export type OldCostume = {
    assetId: string,
    name: string,
    md5?: string,
    md5ext: string,
    textLayerMD5?: string,
    bitmapResolution: number,
    asset?: Asset,
    dataFormat: string,
    rotationCenterX: number,
    rotationCenterY: number,
}

export type OldSound = {
    assetId: string,
    name: string,
    md5?: string,
    md5ext: string,
    asset?: Asset,
    dataFormat: string,
    format: string,
    rate: number,
    sampleCount: number,
}

export interface OldThread {
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

export interface OldSprite {
    id: string,
    name: string,
    isStage: boolean,
    costumes: OldCostume[],
    sounds: OldSound[],
}

export interface OldSpriteJson {
    name: string,
    tags?: string[],
    isStage: boolean,
    variables?: {},
    costumes: OldCostume[],
    sounds: OldSound[],
    blocks?: {},
}

export interface OldSoundJson {
    name: string,
    tags: string[],
    dataFormat: string,
    md5ext: string,
    sampleCount: number,
    assetId: string,
    rate: number,
}

export interface OldTarget extends EventEmitter {
    direction: number
    size: number
    y: number
    x: number
    id: string,
    name: string,
    isStage: boolean,
    currentCostume: number,
    costumes: OldCostume[],
    threads: { [key: string]: OldThread },
    sprite: OldSprite,

    getThread: (id: string) => OldThread,
    addThread: (id: string, trigger: string, script: string) => Promise<string>,
    isSprite: () => boolean,
    
    getCurrentCostume: () => OldCostume,
    getCostumeIndexByName: (name: string) => number,
    setCostume: (costumeIndex: number) => void,
    deleteCostume: (costumeIndex: number) => void,
    getCostumes: () => OldCostume[],

    deleteSound: (soundIndex: number) => void,
    getSounds: () => OldSound[],
}

type GlobalVariable = {
    name: string,
    value: string | number | boolean,
}

export type OldVmState = {
    targets: OldTarget[],
    extensions: any[],
    globalVariables: GlobalVariable[],
    meta: {
        semver: string,
        vm: string,
        agent: string,
    }
}

export type OldProject = OldVmState & {
    name: string,
    lastEdited: Date,
    owner: string,
}

export type OldVmError = { 
    threadId: string, 
    message: string, 
    lineNumber: number, 
    type: OldVmErrorType,
    fresh: boolean,
}

export type OldVmErrorType = "CompileTimeError" | "RuntimeError"