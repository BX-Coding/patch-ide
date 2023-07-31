export type Asset = {
    assetId: string,
    assetType: string,
}

export type Costume = {
    name: string,
    md5: string,
    md5ext: string,
    textLayerMD5: string,
    bitmapResolution: number,
    asset: Asset,
    dataFormat: string,
    rotationCenterX: number,
    rotationCenterY: number,
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

    updateThreadScript: (script: string) => void,
    updateThreadTriggerEvent: (trigger: string) => void,
    updateThreadTriggerEventOption: (option: string) => void,
}

export interface Sprite {
    id: string,
    name: string,
    isStage: boolean,
    currentCostume: number,
    costumes: Costume[],
}

export interface Target {
    id: string,
    name: string,
    isStage: boolean,
    currentCostume: number,
    costumes: Costume[],
    threads: { [key: string]: Thread },
    sprite: Sprite,

    getThread: (id: string) => Thread,
    addThread: (id: string, trigger: string, script: string) => string,
    getCurrentCostume: () => Costume,
}