import EventEmitter from "events"

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

export type Costume = {
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

export type Sound = {
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

    updateThreadScript: (script: string) => void,
    updateThreadTriggerEvent: (trigger: string) => void,
    updateThreadTriggerEventOption: (option: string) => void,
}

export interface Sprite {
    id: string,
    name: string,
    isStage: boolean,
    costumes: Costume[],
    sounds: Sound[],
}

export interface SpriteJson {
    name: string,
    tags?: string[],
    isStage: boolean,
    variables?: {},
    costumes: Costume[],
    sounds: Sound[],
    blocks?: {},
}

export interface SoundJson {
    name: string,
    tags: string[],
    dataFormat: string,
    md5ext: string,
    sampleCount: number,
    assetId: string,
    rate: number,
}

export interface Target extends EventEmitter {
    direction: number
    size: number
    y: number
    x: number
    id: string,
    name: string,
    isStage: boolean,
    currentCostume: number,
    costumes: Costume[],
    threads: { [key: string]: Thread },
    sprite: Sprite,

    getThread: (id: string) => Thread,
    addThread: (id: string, trigger: string, script: string) => Promise<string>,
    
    getCurrentCostume: () => Costume,
    getCostumeIndexByName: (name: string) => number,
    setCostume: (costumeIndex: number) => void,
    deleteCostume: (costumeIndex: number) => void,
    getCostumes: () => Costume[],

    deleteSound: (soundIndex: number) => void,
    getSounds: () => Sound[],
}

type GlobalVariable = {
    name: string,
    value: string | number | boolean,
}

export type VmState = {
    targets: Target[],
    extensions: any[],
    globalVariables: GlobalVariable[],
    meta: {
        semver: string,
        vm: string,
        agent: string,
    }
}

export type Project = VmState & {
    name: string,
    lastEdited: Date,
    owner: string,
}