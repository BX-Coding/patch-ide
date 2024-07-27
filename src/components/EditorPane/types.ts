import { Costume, Sound, Sprite } from "leopard"
import Runtime, { RuntimeState } from "../../engine/runtime"
import patchAssetStorage, { AssetType, isImageAssetType } from "../../engine/storage/storage"

export type PatchProject = RuntimeState & {
    name: string,
    lastEdited: Date,
    owner: string
}

export type VmError = { 
    threadId: string, 
    message: string, 
    lineNumber: number, 
    type: VmErrorType,
    fresh: boolean
}

export type CostumeJson = {
    name: string,
    id: string,
    tags?: string[],
    assetType: AssetType,
    rotationCenterX?: number,
    rotationCenterY?: number
}

export function loadFromAssetJson(asset: CostumeJson | SoundJson | SpriteJson): Costume | Sound | Sprite {
    if (!Object.hasOwn(asset, "assetType")) {
        // Sprite

        const sprite = asset as SpriteJson;

        const newSprite = new Sprite({
            x: 0,
            y: 0,
            direction: 0,
            costumeNumber: 1,
            size: 1,
            visible: true,
            id: ""
        });

        sprite.costumes.forEach(costume => newSprite.addCostume(loadFromAssetJson(costume) as Costume));
        sprite.sounds.forEach(sound => newSprite.addSound(loadFromAssetJson(sound) as Sound));

        return newSprite
    } else {
        /* @ts-ignore */
        if (isImageAssetType(asset.assetType)) {
            const costume = asset as CostumeJson;

            return new Costume(costume.name, patchAssetStorage.loadAsset(costume.id), (costume.rotationCenterX && costume.rotationCenterY) ? { x: costume.rotationCenterX, y: costume.rotationCenterY } : undefined, costume.id)
        } else {
            const sound = asset as SoundJson;

            return new Sound(sound.name, patchAssetStorage.loadAsset(sound.id), sound.id);
        }
    }
}

export type SoundJson = {
    name: string,
    id: string,
    tags?: string[],
    format: string,
    assetType: AssetType,
    rate: number,
    sampleCount: number
}

export interface SpriteJson {
    name: string,
    tags?: string[],
    isStage: boolean,
    variables?: {},
    costumes: CostumeJson[],
    sounds: SoundJson[],
    blocks?: {},
}

export type VmErrorType = "CompileTimeError" | "RuntimeError"